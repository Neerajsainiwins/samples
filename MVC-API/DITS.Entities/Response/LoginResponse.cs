using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Entities.Response
{
    public class LoginResponse: BaseResponse
    {
        public int UserLoginId { get; set; }
        public int UserBasicInformationId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
