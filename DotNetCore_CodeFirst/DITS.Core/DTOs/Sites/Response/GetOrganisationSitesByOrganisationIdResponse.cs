using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.DTOs.Sites.Response
{
    public class GetOrganisationSitesByOrganisationIdResponse
    {
        public List<GetOrganisationSitesByOrganisationId> Data { get; set; }
    }

    public class GetOrganisationSitesByOrganisationId
    {
        public Guid OrganisationSiteId { get; set; }
        public string OrganisationSiteName { get; set; }
        public string Latitude { get; set; } 
        public string Longitude { get; set; }

    }

}
