
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Net;

namespace DShop.Services.Products.Controllers
{
    //[ApiController]
    //[Route("[controller]")]
    public class BaseController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContext;

        public BaseController(IHttpContextAccessor httpContext)
        {
            _httpContext = httpContext;
        }

        [NonAction]
        public int GetTenantId()
        {
            return Convert.ToInt32(_httpContext.HttpContext.Request.Headers["TenantId"]);
        }

        [NonAction]
        public int GetLanguageId()
        {
            return Convert.ToInt32(_httpContext.HttpContext.Request.Headers["LanguageId"]) == 0 || _httpContext.HttpContext.Request.Headers["LanguageId"] == "" ? 1 : Convert.ToInt32(_httpContext.HttpContext.Request.Headers["LanguageId"]);
        }
        [NonAction]
        public int GetUserId()
        {
            return Convert.ToInt32(User.Claims.ToList().Find(x => x.Type == "UserId").Value);
        }
        [NonAction]
        public string GetRoleName()
        {
            return Convert.ToString(User.Claims.ToList().Find(x => x.Type == "Role").Value);
        }
        [NonAction]
        public int GetRoleId()
        {
            return Convert.ToInt32(User.Claims.ToList().Find(x => x.Type == "RoleId").Value);
        }
        //[Route("[action]")]
        //[HttpGet]
        //[ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        //public string Status()
        //{
        //    return "App is live now at " + HttpContext.Request.Host;
        //}
    }
}
