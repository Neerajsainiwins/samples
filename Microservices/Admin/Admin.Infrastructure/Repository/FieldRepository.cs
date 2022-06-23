using Admin.Core.Repositories;
using Admin.Core.Response;
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
    public class FieldRepository : IFieldRepository
    {
        private readonly FieldsController _fieldsController;
        private readonly AdminDbContext _context;
        public FieldRepository(AdminDbContext context, FieldsController fieldsController)
        //: base(context)
        {
            _context = context;
            _fieldsController=fieldsController;
        }

        public async Task<IEnumerable<FieldTypeModel>> GetAllFieldTypes()
        {
            return await _fieldsController.GetAllFieldTypes();
        }

        public async Task<IEnumerable<FieldsOfFieldTypeIdModel>> GetFieldsOfFieldTypeId(int fieldTypeId)
        {
            return await _fieldsController.GetFieldsOfFieldTypeId(fieldTypeId);
        }

        public async Task<ResponseModel> CreateSection(CreateUpdateSection createUpdateSection, int languageId)
        {
            return await _fieldsController.CreateSection(createUpdateSection, languageId);
        }

        public async Task<ResponseModel> CreateFields(CreateUpdateFieldsDTO createUpdateFieldsDTO, int languageId)
        {
            return await _fieldsController.CreateFields(createUpdateFieldsDTO, languageId);
        }

        public FormSectionModel GetFormsByScreenId(int screenId)
        {
            FormSectionModel pageSectionModel = new FormSectionModel();
            var response = _fieldsController.GetFormsByScreenId(screenId);
            pageSectionModel.Data = response;
            return pageSectionModel;
        }

        public DefaultCommonResponseModel DeleteField(DeleteFieldsDTO deleteFieldsDTO)
        {
            return _fieldsController.DeleteField(deleteFieldsDTO);
        }

        public DefaultCommonResponseModel DeleteSection(int sectionId)
        {
            return _fieldsController.DeleteSection(sectionId);
        }

        public GetFormSectionFieldResponse GetFormSectionFields(int formId)
        {
            GetFormSectionFieldResponse pageSectionFieldResponse = new GetFormSectionFieldResponse();
            var response = _fieldsController.GetFormSectionFields(formId);
            pageSectionFieldResponse.Data = response;
            return pageSectionFieldResponse;
        }

        public FormSectionModel GetFormSections(int formId)
        {
            FormSectionModel pageSectionModel = new FormSectionModel();
            var response = _fieldsController.GetFormSections(formId);
            pageSectionModel.Data = response;
            return pageSectionModel;
        }

        public async Task<ResponseModel> UpdateFields(UpdatePageFields updateFieldsDTO)
        {
            return await _fieldsController.UpdateFields(updateFieldsDTO);
        }

        public FieldDTO GetField(FormSectionResponse formSectionResponse)
        {
            FieldDTO fieldDTO = new FieldDTO();
            var response = _fieldsController.GetField(formSectionResponse);
            fieldDTO.Data = response;
            return fieldDTO;
        }
    }
}
