using DITS.Core.Helpers;
using DITS.Application.Questions.Interfaces;
using DITS.Core.DTOs.Common.Response;
using DITS.Core.DTOs.Questions.Request;
using DITS.Core.DTOs.Questions.Response;
using DITS.Core.DTOs.Users.Request;
using DITS.Core.Interfaces.Questions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Application.Questions
{
    public class QuestionServices : IQuestionService
    {
        private readonly IQuestionRepository _questionRepository;
        public QuestionServices(IQuestionRepository questionRepository)
        {
            _questionRepository = questionRepository;
        }

        public async Task<CommonResponse> CreateQuestions(CreateQuestionsDTO createQuestionsDTO, string loggedInUserId)
        {
            try
            {
                return await _questionRepository.CreateQuestions(createQuestionsDTO, loggedInUserId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<PagingHelper<GetQuestionsList>> GetQuestionsList(SearchingDTO paginationDTO)
        {
            try
            {
                return await _questionRepository.GetQuestionsList(paginationDTO);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
