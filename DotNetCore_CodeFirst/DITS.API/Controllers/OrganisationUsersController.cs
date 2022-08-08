using DITS.Core.DTOs.OrganisationUsers.Request;
using DITS.Core.DTOs.OrganisationUsers.Response;
using DITS.Services.OrganisationUsers.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DITS.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrganisationUsersController : BaseController
    {
        private readonly IOrganisationUserService _organisationUserService;
        public OrganisationUsersController(IOrganisationUserService organisationUserService, IHttpContextAccessor httpContext) : base(httpContext)
        {
            _organisationUserService = organisationUserService;
        }

        [HttpDelete]
        [Route("DeleteOrganisationUser")]
        public async Task<IActionResult> DeleteOrganisationUser(Guid organisationId, Guid userId)
        {
            var result = await _organisationUserService.DeleteOrganisationUser(organisationId, userId);
            if (result.Data.Id == new Guid("00000000-0000-0000-0000-000000000000"))
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPost]
        [Route("InviteOrganisationUser")]
        public async Task<IActionResult> InviteOrganisationUser([FromBody] InviteUserDTO inviteUserDTO)
        {
            var loggedInUserId = GetUserId();
            var result = await _organisationUserService.InviteOrganisationUser(inviteUserDTO, loggedInUserId);
            if (result.Data.Id == new Guid("00000000-0000-0000-0000-000000000000"))
                return BadRequest(result);
            return Ok(result);
        }
    }
}
