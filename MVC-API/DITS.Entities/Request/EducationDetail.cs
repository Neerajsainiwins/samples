using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Entities.Request
{
    public partial class EducationDetail
    {
        public int? EducationDetailId { get; set; }
        public int UserBasicInformationId { get; set; }
        public int QualificationType { get; set; }
        public string InstituteName { get; set; }
        public int Course { get; set; }
        public string PassoutYear { get; set; }
        public Nullable<decimal> Percentage { get; set; }
        public bool CurrentlyStudying { get; set; }
    }
}
