using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Authentication.Controllers
{
    public class BaseController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContext;
        
        public BaseController(IHttpContextAccessor httpContext)
        {
            _httpContext = httpContext;
        }

        [NonAction]
        protected async Task<int> GetUserId()
        {
            var res = _httpContext.HttpContext.User.Identity.IsAuthenticated;
            //var accessToken = await _httpContext.HttpContext.GetTokenAsync("access_token");
            //var _accessToken = new JwtSecurityTokenHandler().ReadJwtToken(accessToken);
            string accessToken = await HttpContext.GetTokenAsync("access_token");
            string idToken = await HttpContext.GetTokenAsync("id_token");

            var user = _httpContext.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            int userId = int.TryParse(user, out var id) ? id : 0;
            return userId;
        }
    }
}
