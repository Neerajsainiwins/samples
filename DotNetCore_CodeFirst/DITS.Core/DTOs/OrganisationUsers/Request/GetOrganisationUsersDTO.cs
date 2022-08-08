using DITS.Core.DTOs.Users.Request;

namespace DITS.Core.DTOs.OrganisationUsers.Request
{
    public class GetOrganisationUsersDTO : SearchingDTO
    {
        public Guid OrganisationId { get; set; }
    }
}
