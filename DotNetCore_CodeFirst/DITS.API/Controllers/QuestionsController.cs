using DITS.Application.Questions.Interfaces;
using DITS.Core.DTOs.Questions.Request;
using DITS.Core.DTOs.Questions.Response;
using DITS.Core.DTOs.Users.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DITS.API.Controllers
{
    /// <summary>
    /// This controller is used for Questions.
    /// </summary>
    [Authorize(policy: "Administrator")]
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : BaseController
    {
        private readonly IQuestionService _questionService;

        public QuestionsController(IQuestionService questionService, IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
            _questionService = questionService;
        }

        /// <summary>
        /// This method is used to create new Question.
        /// </summary>
        [HttpPost]
        [Route("CreateQuestions")]
        public async Task<IActionResult> CreateQuestions([FromBody] CreateQuestionsDTO createQuestionsDTO)
        {
            // fetching logged in userId from claims
            var loggedInUserId = GetUserId();
            var result = await _questionService.CreateQuestions(createQuestionsDTO, loggedInUserId);
            if (result.Data.Id == new Guid("00000000-0000-0000-0000-000000000000"))
                return BadRequest(result);
            return Ok(result);
        }

        /// <summary>
        /// This method is used to fetch the list of questions with pagination.
        /// </summary>
        [HttpGet]
        [Route("GetQuestionsList")]
        public async Task<IActionResult> GetQuestionsList([FromQuery] SearchingDTO paginationDTO)
        {
            GetQuestionResponse response = new GetQuestionResponse();
            response.Data = await _questionService.GetQuestionsList(paginationDTO);

            var metadata = new
            {
                response.Data.TotalCount,
                response.Data.PageSize,
                response.Data.CurrentPage,
                response.Data.TotalPages,
                response.Data.HasNext,
                response.Data.HasPrevious
            };

            Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));
            return Ok(response);
        }
    }
}
