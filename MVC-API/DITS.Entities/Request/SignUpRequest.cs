using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Entities.Request
{
 public   class SignUpRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; }
        public string AlternateEmail { get; set; }
        public int ContactNumber { get; set; }
        public int AlternateNumber { get; set; }
        public int? UserBasicInformationId { get; set; }

    }
}
