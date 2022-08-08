

using DITS.Core.DTOs.Common.Response;
using DITS.Core.DTOs.OrganisationUsers.Request;
using DITS.Core.DTOs.OrganisationUsers.Response;
using DITS.Core.Helpers;
using DITS.Core.Interfaces.OrganisationUsers;
using DITS.Services.OrganisationUsers.Interfaces;

namespace DITS.Services.OrganisationUsers
{
    public class OrganisationUserServices : IOrganisationUserService
    {
        private readonly IOrganisationUserRepository _organisationUserRepository;

        public OrganisationUserServices(IOrganisationUserRepository organisationUserRepository)
        {
            _organisationUserRepository = organisationUserRepository;
        }

        public async Task<CommonResponse> DeleteOrganisationUser(Guid organisationId, Guid userId)
        {
            try
            {
                return await _organisationUserRepository.DeleteOrganisationUser(organisationId, userId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<CommonResponse> InviteOrganisationUser(InviteUserDTO inviteUserDTO, string loggedInUserId)
        {
            try
            {
                return await _organisationUserRepository.InviteOrganisationUser(inviteUserDTO, loggedInUserId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
