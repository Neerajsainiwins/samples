using System.Net;
using System.Threading.Tasks;
using AuthIdentityServer.Models;
using AuthIdentityServer.Models.AccountViewModels;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AuthIdentityServer.Controllers
{
    public class RegisterController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public RegisterController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }


        //[HttpGet("index")]
        //public IActionResult Index()
        //{
        //    return View();
        //}

        //[HttpGet]
        //public async Task<IActionResult> Register(string returnUrl)
        //{

        //    var vm = await BuildRegisterViewModelAsync(returnUrl, context);
        //    return View(vm);

        //}

        //private async Task<RegisterViewModel> BuildRegisterViewModelAsync(string returnUrl, AuthorizationRequest context)
        //{
        //    return new RegisterViewModel
        //    {
        //        ReturnUrl = returnUrl,
        //        Email = context?.LoginHint,
        //    };
        //}

        //[HttpPost("Register")]
        //[ProducesResponseType((int)HttpStatusCode.OK)]
        //[ProducesResponseType((int)HttpStatusCode.BadRequest)]
        //public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        //{
        //    var user = new ApplicationUser
        //    {
        //        FirstName = model.User.FirstName,
        //        LastName = model.User.LastName,
        //        UserName = model.Email,
        //        Email = model.Email,
        //        Country = model.User.Country,
        //        State = model.User.State,
        //        City = model.User.City,
        //        ZipCode = model.User.ZipCode,
        //        Street = model.User.Street,
        //        ProfileImage = model.User.ProfileImage
        //    };
        //    var result = await _userManager.CreateAsync(user, model.Password);
        //    if (result.Succeeded)
        //    {
        //        string roleName = "General User";
        //        var response = await _userManager.AddToRoleAsync(user, roleName);
        //    }
        //    return Ok();
        //}
    }
}