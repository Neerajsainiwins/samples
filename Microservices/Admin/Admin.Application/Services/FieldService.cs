using Admin.Application.Interfaces;
using Admin.Core.Interfaces;
using Admin.Core.Repositories;
using Admin.Core.Response;
using DefaultAPIPackage.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Admin.Application.Services
{
    public class FieldService : IFieldService
    {
        private readonly IFieldRepository _fieldRepository;
        private readonly IAppLogger<FieldService> _logger;

        public FieldService(IFieldRepository fieldRepository, IAppLogger<FieldService> logger)
        {
            _fieldRepository = fieldRepository ?? throw new ArgumentNullException(nameof(fieldRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public Task<ResponseModel> CreateFields(CreateUpdateFieldsDTO createUpdateFieldsDTO, int languageId)
        {
            return _fieldRepository.CreateFields(createUpdateFieldsDTO,languageId);
        }

        public Task<ResponseModel> CreateSection(CreateUpdateSection createUpdateSection, int languageId)
        {
            return _fieldRepository.CreateSection(createUpdateSection, languageId);
        }

        public DefaultCommonResponseModel DeleteField(DeleteFieldsDTO deleteFieldsDTO)
        {
            return _fieldRepository.DeleteField(deleteFieldsDTO);
        }

        public DefaultCommonResponseModel DeleteSection(int sectionId)
        {
            return _fieldRepository.DeleteSection(sectionId);
        }

        public Task<IEnumerable<FieldTypeModel>> GetAllFieldTypes()
        {
            return _fieldRepository.GetAllFieldTypes();
        }

        public FieldDTO GetField(FormSectionResponse formSectionResponse)
        {
            return _fieldRepository.GetField(formSectionResponse);
        }

        public Task<IEnumerable<FieldsOfFieldTypeIdModel>> GetFieldsOfFieldTypeId(int fieldTypeId)
        {
            return _fieldRepository.GetFieldsOfFieldTypeId(fieldTypeId);
        }

        public FormSectionModel GetFormsByScreenId(int screenId)
        {
            return _fieldRepository.GetFormsByScreenId(screenId);
        }

        public GetFormSectionFieldResponse GetFormSectionFields(int formId)
        {
            return _fieldRepository.GetFormSectionFields(formId);
        }

        public FormSectionModel GetFormSections(int formId)
        {
            return _fieldRepository.GetFormSections(formId);
        }

        public Task<ResponseModel> UpdateFields(UpdatePageFields updateFieldsDTO)
        {
            return _fieldRepository.UpdateFields(updateFieldsDTO);
        }
    }
}
