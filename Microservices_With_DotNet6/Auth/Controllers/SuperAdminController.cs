using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AuthIdentityServer.data;
using Microsoft.AspNetCore.Identity;
using AuthIdentityServer.Models;
using Authentication.Models.SuperAdminModels;
using AuthIdentityServer.Services;
using Authentication.Services;
using Authentication.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using static IdentityServer4.IdentityServerConstants;
using System.Net.Http;
using IdentityModel.Client;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

namespace Admin.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(LocalApi.PolicyName)]

    public class SuperAdminController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILoginService<ApplicationUser> _loginService;
        private readonly ISuperAdminService _superAdminService;
        private AppDbContext _dbContext;

        public SuperAdminController(UserManager<ApplicationUser> userManager,
                                    RoleManager<IdentityRole> roleManager,
                                    ILoginService<ApplicationUser> loginService,
                                    ISuperAdminService superAdminService,
                                    AppDbContext dbContext)//, IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _loginService = loginService;
            _superAdminService = superAdminService;
            _dbContext = dbContext;

        }

        [HttpPost("CreateSuperAdmin")]
        public async Task<ActionResult<AuthResponseModel>> CreateSuperAdmin(CreateSuperAdminDTO model)
        {
            AuthResponseModel response = new AuthResponseModel();
            ApplicationUser userEmail = await _userManager.FindByEmailAsync(model.UserName);
            if (userEmail == null)
            {
                var user = new ApplicationUser
                {
                    FirstName = "FirstName",
                    LastName = "LastName",
                    UserName = model.UserName,
                    Email = model.UserName
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    string roleName = "Super Admin";
                    IdentityResult roleAssigned = await _userManager.AddToRoleAsync(user, roleName);
                    response = await _superAdminService.CreateSuperAdmin(model);
                    response.Message = "Saved successfully";
                }
            }
            return Ok(response);
        }


        [HttpPost("UpdateSuperAdmin")]
        public async Task<ActionResult<AuthResponseModel>> UpdateSuperAdmin(UpdateSuperAdminDTO model)
        {
            AuthResponseModel response = new AuthResponseModel();
            ApplicationUser user = await _userManager.FindByEmailAsync(model.UserName);

            model.UserName = user.UserName;
            model.Password = user.PasswordHash;

            _dbContext.Entry(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

            response = await _superAdminService.UpdateSuperAdmin(model);
            response.Id = model.Id;
            response.Message = "Updated successfully";
            return Ok(response);
        }

        [HttpDelete]
        public ActionResult DeleteSuperAdmin(DeleteSuperAdmin model)
        {
            var result = _superAdminService.DeleteSuperAdmin(model);
            return Ok(result);
        }

        
        [HttpGet("GetSuperAdmin")]
        [ProducesResponseType(typeof(SuperAdminModel), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<SuperAdminModel> GetSuperAdmin(string id)
        {
            //var userId = GetUserId();
            //var client = new HttpClient();
            //var metaDataResponse = await client.GetDiscoveryDocumentAsync("https://localhost:9001");
            //var accessToken = await HttpContext.GetTokenAsync(OpenIdConnectParameterNames.AccessToken);
            //var response = await client.GetUserInfoAsync(new UserInfoRequest
            //{
            //    Address = metaDataResponse.UserInfoEndpoint,
            //    Token = accessToken
            //});
            return await _superAdminService.GetSuperAdmin(id);
        }

        [HttpPost("GetAllSuperAdmin")]
        public IEnumerable<SuperAdminModel> GetAllSuperAdmin([FromBody] GetAllSuperAdmin model)
        {
            return _superAdminService.GetAllSuperAdmin(model);
        }


        [HttpDelete("DeleteTenants")]
        public async Task<ActionResult<AuthResponseModel>> DeleteTenants(string password, int tenantId, string userId)
        {
            AuthResponseModel response =  new AuthResponseModel();
            //string email = "neeraj.saini@ditstek.com";
            var user = await _userManager.FindByIdAsync(userId);
            //var user = await _loginService.FindByUsername(userId);
            bool validatePassword = await _loginService.ValidateCredentials(user, password);
            if (validatePassword)
            {
                List<IdentityUserRole<string>> userRoles = _dbContext.UserRoles.ToList();
                List<IdentityRole> roles = _dbContext.Roles.ToList();

                bool isExists = (from ur in userRoles
                                 join r in roles on ur.RoleId equals r.Id
                                 where r.Name == "Owner" && ur.UserId == user.Id
                                 select ur).Count() > 0;
                if (isExists)
                {
                    response = await _superAdminService.DeleteTenants(tenantId, user);
                }
                else
                {
                    response.Message = "You're not authorize to delete";
                }
            }
            return response;
        }

        [HttpGet("GetSuperAdminTenants")]
        public IEnumerable<SuperAdminTenants> GetSuperAdminTenants(string userId)
        {
            return _superAdminService.GetSuperAdminTenants(userId);
        }
    }
}
