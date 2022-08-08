using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.Entities.Organisations
{
    public class OrganisationSiteRating
    {
        public Guid OrganisationSiteId { get; set; }
        public Guid DataCycleId { get; set; }
        public decimal? OrganisationSiteScore { get; set; }
    }
}
