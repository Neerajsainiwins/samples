using System;
using System.Collections;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Authentication.Services;
using AuthIdentityServer.data;
using AuthIdentityServer.Models;
using AuthIdentityServer.Models.AccountViewModels;
using AuthIdentityServer.Services;
using IdentityServer4.Models;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace AuthIdentityServer.Controllers
{
    public class AuthController : Controller
    {
        private readonly ILoginService<ApplicationUser> _loginService;
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IClientStore _clientStore;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private AppDbContext _dbContext;
        private readonly IAuthService _authService;
        private readonly IHttpContextAccessor _httpContext;
        private readonly IConfiguration _configuration;


        public AuthController(ILoginService<ApplicationUser> loginService,
            IIdentityServerInteractionService interaction,
            IClientStore clientStore,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            AppDbContext dbContext,
            IAuthService authService,
            IHttpContextAccessor httpContext,
            IConfiguration configuration
            )
        {
            _loginService = loginService;
            _interaction = interaction;
            _clientStore = clientStore;
            _signInManager = signInManager;
            _userManager = userManager;
            _dbContext = dbContext;
            _authService = authService;
            _httpContext = httpContext;
            _configuration = configuration;

        }

        [HttpGet("index")]
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Register(string returnUrl)
        {
            var vm = BuildRegisterViewModelAsync(returnUrl);
            return View(vm);
        }

        private static RegisterViewModel BuildRegisterViewModelAsync(string returnUrl)
        {
            return new RegisterViewModel
            {
                ReturnUrl = returnUrl,
            };
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var emailExist = _authService.Register(model.Email);

                if (emailExist)
                {
                    var user = new ApplicationUser
                    {
                        FirstName = model.User.FirstName,
                        LastName = model.User.LastName,
                        UserName = model.Email,
                        Email = model.Email
                    };
                    var result = await _userManager.CreateAsync(user, model.Password);
                    if (result.Succeeded)
                    {
                        string roleName = "General User";
                        var response = await _userManager.AddToRoleAsync(user, roleName);
                        TempData["Message"] = "Registered Successfully";
                        return Redirect(model.ReturnUrl);
                    }
                    else
                    {
                        foreach (var error in result.Errors)
                        {
                            ModelState.AddModelError("", error.Description);
                        }
                    }
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Sorry your email address does not belong to our database of allowed users");
                }
            }
            return View(model);
        }

        public async Task<IActionResult> Login(string returnUrl)
        {
            var context = await _interaction.GetAuthorizationContextAsync(returnUrl);
            if (context?.IdP != null)
            {
                throw new NotImplementedException("External login is not implemented!");
            }

            var vm = await BuildLoginViewModelAsync(returnUrl, context);
            return View(vm);

        }

        private async Task<LoginViewModel> BuildLoginViewModelAsync(string returnUrl, AuthorizationRequest context)
        {
            var allowLocal = true;
            if (context?.ClientId != null)
            {
                var client = await _clientStore.FindEnabledClientByIdAsync(context.ClientId);
                if (client != null)
                {
                    allowLocal = client.EnableLocalLogin;
                }
            }

            return new LoginViewModel
            {
                ReturnUrl = returnUrl,
                Email = context?.LoginHint
            };
        }


        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                string websiteUrl = "https://"+HttpContext.Request.Host.Value+".tech";
                var userId = await _userManager.FindByEmailAsync(model.Email);
                var res = _authService.Login(model, userId.Id, websiteUrl);
                if (res)
                {
                    var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);
                    if (result.Succeeded)
                    {
                        return Redirect(model.ReturnUrl);
                    }
                    else
                    {
                        ModelState.AddModelError(string.Empty, "Email or Password is incorrect");
                        return View(model);
                    }
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "You don't have access to this tenant");
                    return View(model);
                }
            }
            return View(model);
        }

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> Logout(string logoutId)
        {
            try
            {
                await _signInManager.SignOutAsync();
                LogoutRequest logoutRequest = await _interaction.GetLogoutContextAsync(logoutId);
                return Redirect(logoutRequest.PostLogoutRedirectUri);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException);
            }
        }
    }
}