using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.DTOs.Questions.Response
{
    public class GetLanguagesResponse
    {
        public IEnumerable<GetLanguagesModel> Data { get; set; }
    }

    public class GetLanguagesModel
    {
        public Guid LanguageId { get; set; }
        public string LanguageLabel { get; set; }
    }
}
