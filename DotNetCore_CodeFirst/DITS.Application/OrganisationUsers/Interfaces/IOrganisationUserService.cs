using DITS.Core.DTOs.Common.Response;
using DITS.Core.DTOs.OrganisationUsers.Request;
using DITS.Core.DTOs.OrganisationUsers.Response;
using DITS.Core.Helpers;

namespace DITS.Services.OrganisationUsers.Interfaces
{
    public interface IOrganisationUserService
    {
        Task<CommonResponse> DeleteOrganisationUser(Guid organisationId, Guid userId);
        Task<CommonResponse> InviteOrganisationUser(InviteUserDTO inviteUserDTO, string loggedInUserId);
    }
}
