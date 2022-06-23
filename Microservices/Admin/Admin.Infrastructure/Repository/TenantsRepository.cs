using Admin.Core.Repositories;
using Admin.Infrastructure.Data;
using DefaultAPIPackage.Controllers;
using DefaultAPIPackage.DTOs;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Admin.Infrastructure.Repository
{
    public class TenantsRepository: ITenantsRepository
    {
        private readonly TenantController _tenantController;
        private readonly AdminDbContext _context;
        public TenantsRepository(AdminDbContext context, TenantController tenantController)
        //: base(context)
        {
            _context = context;
            _tenantController = tenantController;
        }
        public async Task<TenantResponse> GetTenantDetails(int Id)
        {
            return await _tenantController.GetTenantDetails(Id);
        }

        public async Task<DefaultCommonResponseModel> TenantDetail(TenantDetailModel model)
        {
            return await _tenantController.TenantDetail(model);
        }
        public async Task<ResponseModel> CreateTenant(TenantModel product)
        {
            var result = await _tenantController.CreateTenant(product);
            return (result.Result as OkObjectResult).Value as ResponseModel;
        }

        public async Task<ResponseModel> DeleteTenant(int id)
        {
            var result = await _tenantController.DeleteTenant(id);
            return (result.Result as OkObjectResult).Value as ResponseModel;
        }

        public async Task<IEnumerable<GetAllTenantResponseModel>> GetAllTenant()
        {
            var result = await _tenantController.GetAllTenants();
            return (result.Result as OkObjectResult).Value as IEnumerable<GetAllTenantResponseModel>;
        }

        public async Task<IEnumerable<ClientTypeRespone>> GetClientTypes()
        {
            return await _tenantController.GetClientTypes();
        }

        public async Task<GetAllTenantResponseModel> GetTenant(int id)
        {
            var result = await _tenantController.GetTenant(id);
            return (result.Result as OkObjectResult).Value as GetAllTenantResponseModel;
        }
    }
}
