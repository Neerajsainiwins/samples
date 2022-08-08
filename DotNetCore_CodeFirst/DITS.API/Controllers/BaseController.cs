using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DITS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContext;

        public BaseController(IHttpContextAccessor httpContext)
        {
            _httpContext = httpContext;
        }

        /// <summary>
        /// This method is used to fetch userId from claims.
        /// </summary>
        [NonAction]
        public string GetUserId()
        {
            return User.Claims.ToList().Find(x => x.Type == "UserId").Value;
        }

        /// <summary>
        /// This method is used to fetch roles list of users from claims.
        /// </summary>
        [NonAction]
        public List<string> GetUserRoles()
        {
            List<string> roles = new List<string>();
            var role = _httpContext.HttpContext.User.Claims.Where(i => i.Type == ClaimTypes.Role).ToList();
            foreach (var item in role)
            {
                roles.Add(item.Value);
            }
            return roles;
        }
    }
}
