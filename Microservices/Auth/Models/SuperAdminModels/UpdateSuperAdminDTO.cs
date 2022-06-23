using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Authentication.Models.SuperAdminModels
{
    public class UpdateSuperAdminDTO
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public List<int> TenantId { get; set; }
    }
}
