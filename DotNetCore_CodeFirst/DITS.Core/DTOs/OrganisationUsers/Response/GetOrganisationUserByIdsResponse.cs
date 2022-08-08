namespace DITS.Core.DTOs.OrganisationUsers.Response
{
    public class GetOrganisationUserByIdsResponse
    {
        public Guid OrganisationId { get; set; }
        public Guid UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }

        public string? PhysicalAddress { get; set; }
        
        public bool IsAdministrator { get; set; }
        public List<Guid>? OrganisationSiteIds { get; set; }
    }
}
