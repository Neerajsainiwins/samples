using Admin.Core.Repositories;
using Admin.Core.RequestModel;
using Admin.Infrastructure.Data;
using DefaultAPIPackage.Controllers;
using DefaultAPIPackage.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Admin.Infrastructure.Repository
{
    public class LookupsRepository : ILookupsRepository
    {
        private readonly LookupController _lookupController;
        private readonly AdminDbContext _context;
        public LookupsRepository(AdminDbContext context, LookupController lookupController)
        //: base(context)
        {
            _context = context;
            _lookupController = lookupController;
        }

        public async Task<ResponseModel> CreateUpdateLookupDetails(GetLookupModel lookupDetailDTOs)
        {
            return await _lookupController.CreateUpdateLookupDetails(lookupDetailDTOs);
        }

        public CommonResponseModel DeleteLookup(DeleteLookup deleteLookup)
        {
            Response res = new Response();
            CommonResponseModel commonResponseModel = new CommonResponseModel(null, "");
            var response = _lookupController.DeleteLookup(deleteLookup);
            if (response.Id == 0)
            {
                res.Id = 0;
                commonResponseModel.Data = null;
                return commonResponseModel;
            }
            res.Id = 1;
            commonResponseModel.Data = res;
            return commonResponseModel;
        }

        public GetFieldLookupsDataResponse GetFieldLookupsData(FieldLookupsDataDTO fieldLookupsDataDTO)
        {
            GetFieldLookupsDataResponse getFieldLookupsDataResponse = new GetFieldLookupsDataResponse();
            var response = _lookupController.GetFieldLookupsData(fieldLookupsDataDTO);
            getFieldLookupsDataResponse.Data = response;
            return getFieldLookupsDataResponse;
        }

        public GetLookupDetailsDTO GetLookupDetails(LookupRequestModel lookupRequestModel)
        {
            GetLookupDetailsDTO getLookupDetailsDTO = new GetLookupDetailsDTO();
            var response = _lookupController.GetLookupDetails(lookupRequestModel);
            getLookupDetailsDTO.Data = response;
            return getLookupDetailsDTO;
        }

        public LookupDefaultSortingDTO GetLookupSorting()
        {
            LookupDefaultSortingDTO lookupDefaultSortingDTO = new LookupDefaultSortingDTO();
            var response = _lookupController.GetLookupSorting();
            lookupDefaultSortingDTO.Data = response;
            return lookupDefaultSortingDTO;
        }

        public LookupsResponseDTO GetLookupTypes(int? screenId)
        {
            LookupsResponseDTO lookupsResponseDTO = new LookupsResponseDTO();
            var response = _lookupController.GetLookupTypes(screenId);
            lookupsResponseDTO.Data = response;
            return lookupsResponseDTO;
        }
    }
}
