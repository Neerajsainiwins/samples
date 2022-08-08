using DITS.Core.Helpers;
using DITS.Core.DTOs.Common.Response;
using DITS.Core.DTOs.Questions.Request;
using DITS.Core.DTOs.Questions.Response;
using DITS.Core.DTOs.Users.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Application.Questions.Interfaces
{
    public interface IQuestionService
    {
        Task<CommonResponse> CreateQuestions(CreateQuestionsDTO createQuestionsDTO, string loggedInUserId);
        Task<PagingHelper<GetQuestionsList>> GetQuestionsList(SearchingDTO paginationDTO);
    }
}
