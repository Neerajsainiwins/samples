using DITS.Core.Helpers;

namespace DITS.Core.DTOs.OrganisationUsers.Response
{
    public class GetOrganisationUsersResponse
    {
        public PagingHelper<GetOrganisationUsersList>? Data { get; set; }
    }

    public class GetOrganisationUsersList
    {
        public Guid UserId { get; set; }
        public string? FullName { get; set; }
        public string? RoleName { get; set; }
    }

}
