using Authentication.Models.SuperAdminModels;
using AuthIdentityServer.Models.AccountViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Authentication.Services
{
    public interface IAuthService
    {
        bool Login(LoginViewModel model, string userId, string url);
        bool Register(string email);
    }
}
