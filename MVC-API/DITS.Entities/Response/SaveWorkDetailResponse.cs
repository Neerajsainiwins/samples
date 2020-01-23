using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Entities.Response
{
    public class SaveWorkDetailResponse : BaseResponse
    {
        public GetWorkDetailResponse GetWorkDetailResponse { get; set; }
    }

    public class GetWorkDetailResponse
    {
        public int? OrganizationType { get; set; }
        public string OrganisationName { get; set; }
        public string Designation { get; set; }
        public int? StartMonth { get; set; }
        public int? EndMonth { get; set; }
        public int? StartYear { get; set; }
        public int? EndYear { get; set; }
        public int UserBasicInformationId { get; set; }
        public int UserWorkDetailId { get; set; }
    }
}
