using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Entities.Response
{
    public class BaseResponse
    {
        private bool p_success = true;

        public Boolean Success
        {
            get
            {
                return p_success;
            }
            set
            {
                p_success = value;
            }
        }
        public string Message { get; set; }
    }
}
