using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Authentication.Models.SuperAdminModels
{
    public class CreateSuperAdminDTO
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public List<int> TenantId { get; set; }
    }

    public class GetUserTenant
    {
        public string UserId { get; set; }
        public int TenantId { get; set; }
    }   
    
}
