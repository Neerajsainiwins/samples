using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.DTOs.Sites.Request
{
    public class CreateSitesDTO
    {
        public string OrganisationSiteName { get; set; }
        public Guid OrganisationId { get; set; }
        public string LatLong { get; set; }
        public string Address { get; set; }
        public Guid SectorId { get; set; }
        public Guid SubSectorId { get; set; }
        public Guid InternalSectorId { get; set; }
        public int NumberOfWorkers { get; set; }
    }

    public class UpdateSitesDTO : CreateSitesDTO
    {
        public Guid OrganisationSiteId { get; set; }
    }
}
