using Authentication.Models.SuperAdminModels;
using AuthIdentityServer.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Authentication.Services
{
    public interface ISuperAdminService
    {
        Task<AuthResponseModel> CreateSuperAdmin(CreateSuperAdminDTO model);
        Task<AuthResponseModel> UpdateSuperAdmin(UpdateSuperAdminDTO model);
        AuthResponseModel DeleteSuperAdmin(DeleteSuperAdmin model);
        Task<SuperAdminModel> GetSuperAdmin(string userId);
        IEnumerable<SuperAdminModel> GetAllSuperAdmin(GetAllSuperAdmin model);
        Task<AuthResponseModel> DeleteTenants(int tenantId, ApplicationUser user);
        IEnumerable<SuperAdminTenants> GetSuperAdminTenants(string userId);
    }
}
