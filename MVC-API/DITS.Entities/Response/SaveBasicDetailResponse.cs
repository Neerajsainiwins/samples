using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Entities.Response
{
 public   class SaveBasicDetailResponse:BaseResponse
    {
        public BasicDetailResponse BasicDetailResponse { get; set; }
    }

    public class BasicDetailResponse
    {
        public int UserBasicInformationId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string FatherName { get; set; }
        public string MotherName { get; set; }
        public int Gender { get; set; }
        public string DateOfBirth { get; set; }
        public int? BloodGroup { get; set; }
        public int? MaritalStatus { get; set; }
        public string Anniversarydate { get; set; }
        public string DateOfJoining { get; set; }
        public string Hobbies { get; set; }
        public int? Nationality { get; set; }
        public int? Religion { get; set; }
    }
}
