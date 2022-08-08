using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Authentication.Models.SuperAdminModels
{
    public class SuperAdminModel
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public List<SuperAdminTenants> TenantId { get; set; }
    }
    public class SuperAdminTenants
    {
        public int TenantId { get; set; }
        public string TenantName { get; set; }
    }
    public class GetAllTenantsModel
    {
        public int Id { get; set; }
        public string ClientName { get; set; }
        public int ClientTypeId { get; set; }
        public string ClientType { get; set; }
        public string UrlLink { get; set; }
        public int NumberOfUsers { get; set; }
        public int NumberOfAdministrators { get; set; }
    }

    public class GetAllSuperAdmin : SearchDTO
    {
        public int TenantId { get; set; }
    }
}
