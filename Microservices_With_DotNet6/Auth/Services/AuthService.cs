using AuthIdentityServer.data;
using AuthIdentityServer.Models.AccountViewModels;
using DefaultAPIPackage.API.Models;
using System.Linq;

namespace Authentication.Services
{
    public class AuthService : IAuthService
    {
        private AppDbContext _dbContext;
        private DatabaseContext _dbDefaultContext;

        public AuthService(AppDbContext dbContext, 
                           DatabaseContext dbDefaultContext)
        {
            _dbContext = dbContext;
            _dbDefaultContext = dbDefaultContext;
        }

        public bool Login(LoginViewModel model, string userId, string url)
        {
            //var url = "https://tenantname1.davigold.com";
            var roleId = _dbContext.UserRoles.Where(x => x.UserId == userId).Select(x => x.RoleId).FirstOrDefault();
            var roleName = _dbContext.Roles.Where(x => x.Id == roleId).Select(x => x.Name).FirstOrDefault();
            if (roleName == "Owner")
            {
                return true;
            }
            else
            {
                var tenantId = _dbDefaultContext.TenantConfigurations.Where(x => x.UrlLink == url && x.IsActive == true && x.IsDeleted == false).Select(x => x.Id).FirstOrDefault();
                var userCount = _dbContext.UserTenants.Where(x => x.UserId == userId && x.TenantId == tenantId).Count();
                if (userCount > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public bool Register(string email)
        {
            var emailExist = _dbDefaultContext.CompanyInformations.Where(x => x.BusinessEmail == email).Count();
            if (emailExist > 0)
                return true;
            return false;
        }
    }
}