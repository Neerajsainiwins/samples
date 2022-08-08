using Admin.Application.Interfaces;
using Admin.Core.Response;
using DefaultAPIPackage.DTOs;
using DShop.Services.Products.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Admin.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FieldController : BaseController
    {
        private readonly IFieldService _fieldService;
        public FieldController(IFieldService fieldService, IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
            _fieldService = fieldService;
        }

        [HttpGet("GetAllFieldTypes")]
        public async Task<ActionResult<GetFieldTypeResponse>> GetAllFieldTypes()
        {
            GetFieldTypeResponse response = new GetFieldTypeResponse();
            response.Data = await _fieldService.GetAllFieldTypes();
            return Ok(response);
        }

        [HttpGet("GetFieldsOfFieldTypeId")]
        public async Task<ActionResult<GetFieldsOfFieldTypeResponse>> GetFieldsOfFieldTypeId(int fieldTypeId)
        {
            GetFieldsOfFieldTypeResponse response = new GetFieldsOfFieldTypeResponse();
            response.Data = await _fieldService.GetFieldsOfFieldTypeId(fieldTypeId);
            return Ok(response);
        }

        [HttpPost("CreateFields")]
        public async Task<ResponseModel> CreateFields(CreateUpdateFieldsDTO createUpdateFieldsDTO)
        {
            int languageId = GetLanguageId();
            return await _fieldService.CreateFields(createUpdateFieldsDTO, languageId);
        }

        [HttpPost("CreateSection")]
        public async Task<ResponseModel> CreateSection(CreateUpdateSection createUpdateSection)
        {
            int languageId = GetLanguageId();
            return await _fieldService.CreateSection(createUpdateSection, languageId);
        }

        [HttpGet("GetFormsByScreenId")]
        public FormSectionModel GetFormsByScreenId(int screenId)
        {
            return _fieldService.GetFormsByScreenId(screenId);
        }

        [HttpGet("GetFormSectionFields")]
        public GetFormSectionFieldResponse GetFormSectionFields(int formId)
        {
            return _fieldService.GetFormSectionFields(formId);
        }

        [HttpDelete("DeleteField")]
        public DefaultCommonResponseModel DeleteField([FromBody] DeleteFieldsDTO deleteFieldsDTO)
        {
            return _fieldService.DeleteField(deleteFieldsDTO);
        }

        [HttpDelete("DeleteSection")]
        public DefaultCommonResponseModel DeleteSection(int sectionId)
        {
            return _fieldService.DeleteSection(sectionId);
        }

        [HttpGet("GetFormSections")]
        public FormSectionModel GetFormSections(int formId)
        {
            return _fieldService.GetFormSections(formId);
        }

        [HttpPost("UpdateFields")]
        public async Task<ResponseModel> UpdateFields(UpdatePageFields updateFieldsDTO)
        {
            return await _fieldService.UpdateFields(updateFieldsDTO);
        }

        [HttpPost("GetFieldById")]
        public FieldDTO GetField(FormSectionResponse formSectionResponse)
        {
            return _fieldService.GetField(formSectionResponse);
        }
    }
}
