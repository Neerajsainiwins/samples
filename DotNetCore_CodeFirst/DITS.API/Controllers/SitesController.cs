using DITS.Application.Sites.Interfaces;
using DITS.Core.DTOs.Sites.Request;
using DITS.Core.DTOs.Sites.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DITS.API.Controllers
{
    /// <summary>
    /// This controller is used for sites.
    /// </summary>
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SitesController : BaseController
    {
        private readonly ISitesService _sitesService;

        public SitesController(ISitesService siteService, IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
            _sitesService = siteService;
        }

        /// <summary>
        /// This method is used to fetch list of sites of logged in user.
        /// </summary>
        [HttpGet]
        [Route("GetUserSiteDetails")]
        public GetUserSiteDetailsResponse GetUserSiteDetails()
        {
            // fetching logged in userId from claims
            var loggedInUserId = GetUserId();
            return _sitesService.GetUserSiteDetails(loggedInUserId);
        }
    }
}
