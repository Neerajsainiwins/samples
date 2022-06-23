using Admin.Core.Repositories;
using Admin.Core.RequestModel;
using Admin.Core.Response;
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
    public class LabelRepository : ILabelRepository
    {
        private readonly LabelsController _labelsController;
        private readonly AdminDbContext _context;
        public LabelRepository(AdminDbContext context, LabelsController labelsController)
        //: base(context)
        {
            _context = context;
            _labelsController = labelsController;
        }

        public async Task<ActionResult<ButtonResponse>> GetButtons()
        {
            ButtonResponse buttonResponse = new ButtonResponse();
            var response = await _labelsController.GetButtons();
            buttonResponse.Data = response;
            return buttonResponse;
        }

        public async Task<IEnumerable<LabelsModel>> GetLabels()
        {
            return await _labelsController.GetLabels();
        }

        public async Task<ModuleLabelsResponse> GetModuleLabels(ModuleLabelsDTO moduleLabelsDTO, int tenantId, int roleId)
        {
            ModuleLabels moduleLabels = new ModuleLabels();
            moduleLabels.LabelId = moduleLabelsDTO.LabelId;
            moduleLabels.ScreenId = moduleLabelsDTO.ScreenId;
            moduleLabels.TenantId = tenantId;
            moduleLabels.RoleId = roleId;
            return await _labelsController.GetModuleLabels(moduleLabels);
        }

        public CommonResponseModel UpdateModuleLabels(UpdateModuleLabels updateModuleLabels)
        {
            Response res = new Response();
            CommonResponseModel response = new CommonResponseModel(res, "");
            var result = _labelsController.UpdateModuleLabels(updateModuleLabels);
            res.Id = result.Id;
            response.Data = res;
            response.Message = result.Message;
            return response;
        }
    }
}
