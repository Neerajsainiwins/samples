using Admin.Core.Response;
using System.Collections.Generic;
using DefaultAPIPackage.DTOs;
using System.Threading.Tasks;

namespace Admin.Application.Interfaces
{
    public interface IFieldService
    {
        Task<IEnumerable<FieldTypeModel>> GetAllFieldTypes();
        Task<IEnumerable<FieldsOfFieldTypeIdModel>> GetFieldsOfFieldTypeId(int fieldTypeId);
        Task<ResponseModel> CreateFields(CreateUpdateFieldsDTO createUpdateFieldsDTO, int languageId);
        Task<ResponseModel> CreateSection(CreateUpdateSection createUpdateSection, int languageId);
        FormSectionModel GetFormsByScreenId(int screenId);
        GetFormSectionFieldResponse GetFormSectionFields(int formId);
        DefaultCommonResponseModel DeleteField(DeleteFieldsDTO deleteFieldsDTO);
        DefaultCommonResponseModel DeleteSection(int sectionId);
        FormSectionModel GetFormSections(int formId);
        Task<ResponseModel> UpdateFields(UpdatePageFields updateFieldsDTO);
        FieldDTO GetField(FormSectionResponse formSectionResponse);
    }
}
