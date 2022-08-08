using DITS.Core.Helpers;

namespace DITS.Core.DTOs.Sites.Response
{
    public class GetOrgSitesByOrgIdAndUserIdResponseDTO
    {
        public PagingHelper<GetOrgnSitesByOrgIdAndUserId>? Data { get; set; }
    }

    public class GetOrgnSitesByOrgIdAndUserId
    {
        public Guid OrganisationSiteId { get; set; }
        public string? OrganisationSiteName { get; set; }
        public bool IsOrganisationSiteIdChecked { get; set; }

    }
}
