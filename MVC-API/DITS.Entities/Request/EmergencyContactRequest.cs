using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Entities.Request
{
    public class EmergencyContactRequest
    {
        public string Name { get; set; }
        public int? Relation { get; set; }
        public int? Occupation { get; set; }
        public string ContactNumber { get; set; }
        public int? UserBasicInformationId { get; set; }
        public int? UserEmergencyContactId { get; set; }
    }
}
