using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.DTOs.Questions.Request
{
    public class DeleteAudiosAndTranslationsDTO
    {
        public Guid QuestionId { get; set; }
        public Guid LanguageId { get; set; }
    }
}
