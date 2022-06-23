using DefaultAPIPackage.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Admin.Core.Response
{
    public class FormSectionModel
    {
        public IEnumerable<FormDTO> Data { get; set; }
    }
    public class FieldDTO
    {
        public CreateUpdateFieldsDTO Data { get; set; }
    }
    public class GetFieldTypeResponse
    {
        public IEnumerable<FieldTypeModel> Data { get; set; }
    }
    public class GetFormSectionFieldResponse
    {
        public GetFormSectionFields Data { get; set; }
    }
    public class GetFieldsOfFieldTypeResponse
    {
        public IEnumerable<FieldsOfFieldTypeIdModel> Data { get; set; }
    }
}
