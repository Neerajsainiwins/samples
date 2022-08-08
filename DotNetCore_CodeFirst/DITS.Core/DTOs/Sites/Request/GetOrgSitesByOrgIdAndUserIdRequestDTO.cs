using DITS.Core.DTOs.Users.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.DTOs.Sites.Request
{
    public class GetOrgSitesByOrgIdAndUserIdRequestDTO : SearchingDTO
    {
        public Guid OrganisationId { get; set; }
        public Guid? UserId { get; set; }
    }
}
