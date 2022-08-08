using Authentication.Models;
using Authentication.Models.SuperAdminModels;
using AuthIdentityServer.data;
using AuthIdentityServer.Models;
using DefaultAPIPackage.API.Models;
using DefaultAPIPackage.Controllers;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Services
{
    public class SuperAdminService : ISuperAdminService
    {
        private AppDbContext _dbContext;
        private DatabaseContext _dbDefaultContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TenantController _tenantController;
        public SuperAdminService(AppDbContext dbContext,
                                 DatabaseContext dbDefaultContext,
                                 UserManager<ApplicationUser> userManager, TenantController tenantController)
        {
            _dbContext = dbContext;
            _dbDefaultContext = dbDefaultContext;
            _userManager = userManager;
            _tenantController = tenantController;
        }

        public async Task<AuthResponseModel> CreateSuperAdmin(CreateSuperAdminDTO model)
        {
            ApplicationUser userEmail = await _userManager.FindByEmailAsync(model.UserName);
            AuthResponseModel response = new AuthResponseModel();
            foreach (var t in model.TenantId)
            {
                UserTenant aspNetTenant = new UserTenant();
                aspNetTenant.UserId = userEmail.Id;
                aspNetTenant.TenantId = t;
                _dbContext.UserTenants.Add(aspNetTenant);
            }

            _dbContext.SaveChanges();

            return response;
        }

        public async Task<AuthResponseModel> UpdateSuperAdmin(UpdateSuperAdminDTO model)
        {
            ApplicationUser userEmail = await _userManager.FindByEmailAsync(model.UserName);
            AuthResponseModel response = new AuthResponseModel();

            IList<TenantIds> tenantIds = new List<TenantIds>();

            foreach (var t in model.TenantId)
            {
                var deliveryModel = new TenantIds();
                deliveryModel.Id = t;
                tenantIds.Add(deliveryModel);
            }
            var myDataIds = tenantIds.Select(a => a.Id).ToList();
            var dataToDelete = _dbContext.UserTenants.Where(a => !myDataIds.Contains(a.Id) && a.UserId == model.Id).ToList();
            _dbContext.UserTenants.RemoveRange(dataToDelete);
            _dbContext.SaveChanges();

            var myNewDataIds = tenantIds.Select(a => a.Id).ToList();
            var myTenantList = _dbContext.UserTenants.Where(a => a.UserId == model.Id).Select(a => a.TenantId).ToList();
            var dataToAdd = tenantIds.Where(a => !myTenantList.Contains(a.Id)).ToList();

            foreach (var r in dataToAdd)
            {
                UserTenant x = new UserTenant();
                x.TenantId = r.Id;
                x.UserId = model.Id;
                _dbContext.UserTenants.Add(x);
            }

            _dbContext.SaveChanges();
            return response;
        }

        public AuthResponseModel DeleteSuperAdmin(DeleteSuperAdmin model)
        {
            AuthResponseModel response = new AuthResponseModel();
            try
            {
                IList<SuperAdminIds> superAdminIds = new List<SuperAdminIds>();

                foreach (var t in model.SuperAdminIds)
                {
                    var deliveryModel = new SuperAdminIds();
                    deliveryModel.Id = t;
                    superAdminIds.Add(deliveryModel);
                }
                var myDataIds = superAdminIds.Select(a => a.Id).ToList();
                var dataToDelete = _dbContext.UserTenants.Where(a => myDataIds.Contains(a.UserId)).ToList();
                _dbContext.UserTenants.RemoveRange(dataToDelete);

                var rolesToDelete = _dbContext.UserRoles.Where(a => myDataIds.Contains(a.UserId)).ToList();
                _dbContext.UserRoles.RemoveRange(rolesToDelete);
                _dbContext.SaveChanges();
                response.Message = "Deleted successfully";
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return response;

        }

        public async Task<SuperAdminModel> GetSuperAdmin(string userId)
        {
            SuperAdminModel superAdminModel = new SuperAdminModel();
            IList<TenantIds> tenantIds = new List<TenantIds>();

            var superAdminDetail = await _userManager.FindByIdAsync(userId);
            superAdminModel.Id = superAdminDetail.Id;
            superAdminModel.UserName = superAdminDetail.UserName;

            var tenantList = _dbDefaultContext.TenantConfigurations.Where(x => x.IsActive == true && x.IsDeleted == false).ToList();

            var superAdminTenantList = (from t in tenantList
                                        join ut in _dbContext.UserTenants on t.Id equals ut.TenantId
                                        where ut.UserId == userId
                                        select new SuperAdminTenants
                                        {
                                            TenantId = t.Id,
                                            TenantName = t.ClientName
                                        }).ToList();
            superAdminModel.TenantId = superAdminTenantList;
            return superAdminModel;
        }

        public IEnumerable<SuperAdminModel> GetAllSuperAdmin(GetAllSuperAdmin model)
        {
            model.PageNo = model.PageNo == 0 ? 1 : model.PageNo;
            model.PageSize = model.PageSize == 0 ? 10 : model.PageSize;

            IList<TenantIds> tenantIds = new List<TenantIds>();

            IEnumerable<SuperAdminModel> usersList = (from ur in _dbContext.UserRoles
                                                      join u in _dbContext.Users on ur.UserId equals u.Id
                                                      join r in _dbContext.Roles on ur.RoleId equals r.Id
                                                      where r.Name == "Super Admin"
                                                      select new SuperAdminModel
                                                      {
                                                          Id = u.Id,
                                                          UserName = u.UserName
                                                      }).ToList();

            SearchByName(ref usersList, model.SearchValue);

            if (model.SortOrder == "Desc" || model.SortOrder == "desc" || model.SortOrder == "DESC")
            {
                if (model.SortColumn != "")
                {
                    usersList = usersList.OrderByDescending(x => x.GetType().GetProperty(model.SortColumn).GetValue(x));
                }
            }
            else
            {
                if (model.SortColumn != "")
                {
                    usersList = usersList.OrderBy(x => x.GetType().GetProperty(model.SortColumn).GetValue(x));
                }
            }

            usersList = usersList.Skip((model.PageNo - 1) * model.PageSize).Take(model.PageSize).ToList();

            var tenantList = _dbDefaultContext.TenantConfigurations.Where(x => x.IsActive == true && x.IsDeleted == false).ToList();

            foreach (var user in usersList)
            {
                user.TenantId = (from t in tenantList
                                 join ut in _dbContext.UserTenants on t.Id equals ut.TenantId
                                 where ut.UserId == user.Id
                                 select new SuperAdminTenants
                                 {
                                     TenantId = t.Id,
                                     TenantName = t.ClientName
                                 }).ToList();
            }
            return usersList;
        }

        private void SearchByName(ref IEnumerable<SuperAdminModel> usersList, string SearchValue)
        {
            if (!usersList.Any() || string.IsNullOrWhiteSpace(SearchValue))
                return;
            usersList = usersList.Where(o => o.UserName.ToLower().Contains(SearchValue.Trim().ToLower()));
        }

        public async Task<AuthResponseModel> DeleteTenants(int tenantId, ApplicationUser user)
        {
            AuthResponseModel response = new AuthResponseModel();
            var list = _dbContext.UserTenants.Where(c => c.TenantId == tenantId).ToList();
            _dbContext.UserTenants.RemoveRange(list);
            var res = _dbContext.SaveChanges();

            if (res >= 0)
            {
                await _userManager.DeleteAsync(user);
                await _tenantController.DeleteTenant(tenantId);
                response.Message = "Deleted successfully";
            }            
            return response;
        }

        public IEnumerable<SuperAdminTenants> GetSuperAdminTenants(string userId)
        {
            IEnumerable<SuperAdminTenants> superAdminTenants = new List<SuperAdminTenants>();
            var tenantList = _dbDefaultContext.TenantConfigurations.Where(x => x.IsActive == true && x.IsDeleted == false).ToList();
            var roleId = _dbContext.UserRoles.Where(x => x.UserId == userId).Select(x => x.RoleId).FirstOrDefault();
            var roleName = _dbContext.Roles.Where(x => x.Id ==  roleId).Select(x => x.Name).FirstOrDefault();

            if (roleName == "Owner")
            {
                superAdminTenants = (from t in tenantList
                                     select new SuperAdminTenants
                                     {
                                         TenantId = t.Id,
                                         TenantName = t.ClientName
                                     }).ToList();
            }
            else
            {
                superAdminTenants = (from t in tenantList
                                     join ut in _dbContext.UserTenants on t.Id equals ut.TenantId
                                     where ut.UserId == userId
                                     select new SuperAdminTenants
                                     {
                                         TenantId = t.Id,
                                         TenantName = t.ClientName
                                     }).ToList();
            }
            return superAdminTenants;
        }

        private class TenantIds
        {
            public int Id { get; set; }
        }
        private class SuperAdminIds
        {
            public string Id { get; set; }
        }
    }
}