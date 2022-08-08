using DITS.Core.DTOs.Common.Response;
using DITS.Core.DTOs.OrganisationUsers.Request;
using DITS.Core.DTOs.OrganisationUsers.Response;
using DITS.Core.DTOs.Users.Request;
using DITS.Core.Helpers;

namespace DITS.Core.Interfaces.OrganisationUsers
{
    public interface IOrganisationUserRepository
    {
        Task<CommonResponse> DeleteOrganisationUser(Guid organisationId, Guid userid);
        Task<CommonResponse> InviteOrganisationUser(InviteUserDTO inviteUserDTO, string loggedInUserId);
        Task<CommonResponse> UpdateOrganisationUser(UpdateUserDTO updateUserDTO, string loggedInUserId);
    }
}
