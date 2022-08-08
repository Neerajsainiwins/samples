using DITS.Core.DTOs.Common.Response;
using DITS.Core.DTOs.Common.Ṛesponse;
using DITS.Core.DTOs.Questions.Request;
using DITS.Core.DTOs.Questions.Response;
using DITS.Core.DTOs.Users.Request;
using DITS.Core.Helpers;
using DITS.Core.Interfaces.Questions;
using DITS.Core.Questions;
using DITS.Infrastucture.Data;
using DITS.Infrastucture.Enums;
using DITS.Infrastucture.Repositories.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text.RegularExpressions;

namespace DITS.Infrastucture.Repositories.Questions
{
    public class QuestionRepository : IQuestionRepository
    {
        private readonly Context _dbContext;
        private readonly IConfiguration _configuration;
        private readonly ILogger<QuestionRepository> _logger;
        public QuestionRepository(Context dbContext, IConfiguration configuration, ILogger<QuestionRepository> logger)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _logger = logger;
        }

        /// <summary>
        /// This method is used to create new Question.
        /// </summary>
        public async Task<CommonResponse> CreateQuestions(CreateQuestionsDTO createQuestionsDTO, string loggedInUserId)
        {
            CommonResponse response = new CommonResponse();
            ResponseModel responseModel = new ResponseModel();
            var questionId = Guid.Empty; var internalIdString = string.Empty; var internalId = string.Empty;
            var languageName = LanguageEnums.English.ToString();

            // fetching languageId 
            var languageId = _dbContext.Languages.Where(x => x.LanguageLabel == languageName).AsNoTracking().Select(x => x.LanguageId).FirstOrDefault();

            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var indicatorLabel = _dbContext.Indicators.Where(x => x.IndicatorId == createQuestionsDTO.IndicatorId).AsNoTracking().Select(x => x.IndicatorLabel).FirstOrDefault();
                    internalIdString = Regex.Replace(indicatorLabel, @"\s", "");

                    // creating internalId for question
                    var internalIdCount = _dbContext.Questions.AsNoTracking().Where(x => x.IndicatorId == createQuestionsDTO.IndicatorId).Count();
                    if (internalIdCount > 0)
                        internalId = internalIdString.Substring(0, internalIdString.Length > 18 ? 18 : internalIdString.Length) + "" + (internalIdCount + 1);
                    else
                        internalId = internalIdString.Substring(0, internalIdString.Length > 18 ? 18 : internalIdString.Length);

                    // saving question into database
                    Question question = new Question();
                    question.IndicatorId = createQuestionsDTO.IndicatorId;
                    question.InternalId = internalId;
                    question.QuestionText = createQuestionsDTO.QuestionText;
                    question.IsConsentQuestion = createQuestionsDTO.IsConsentQuestion;
                    question.IsAnticoachingQuestion = createQuestionsDTO.IsAnticoachingQuestion;
                    question.IsSurveySetupElementQuestion = createQuestionsDTO.IsSurveySetupElementQuestion;
                    question.IsSegmentationQuestion = createQuestionsDTO.IsSegmentationQuestion;
                    question.IsCoreQuestion = createQuestionsDTO.IsCoreQuestion;
                    question.Dtmf1Code = createQuestionsDTO.Dtmf1Code;
                    question.Dtmf2Code = createQuestionsDTO.Dtmf2Code;
                    question.Dtmf3Code = createQuestionsDTO.Dtmf3Code;
                    question.Dtmf4Code = createQuestionsDTO.Dtmf4Code;
                    question.Dtmf5Code = createQuestionsDTO.Dtmf5Code;
                    question.Dtmf6Code = createQuestionsDTO.Dtmf6Code;
                    question.Dtmf7Code = createQuestionsDTO.Dtmf7Code;
                    question.Dtmf8Code = createQuestionsDTO.Dtmf8Code;
                    question.Dtmf9Code = createQuestionsDTO.Dtmf9Code;
                    question.CreatedBy = loggedInUserId;
                    question.CreatedOn = DateTime.Now;
                    question.UpdatedBy = loggedInUserId;
                    question.UpdatedOn = DateTime.Now;
                    await _dbContext.AddAsync(question);
                    await _dbContext.SaveChangesAsync();
                    questionId = question.QuestionId;

                    // saving segmentation questions if IsSegmentation is true
                    if (createQuestionsDTO.IsSegmentationQuestion)
                    {
                        SegmentationQuestion segmentationQuestion = new SegmentationQuestion();
                        segmentationQuestion.ChartTitle = createQuestionsDTO.SegmentationQuestion.ChartTitle;
                        segmentationQuestion.Keypad1Description = createQuestionsDTO.SegmentationQuestion.Keypad1Description;
                        segmentationQuestion.Keypad2Description = createQuestionsDTO.SegmentationQuestion.Keypad2Description;
                        segmentationQuestion.Keypad3Description = createQuestionsDTO.SegmentationQuestion.Keypad3Description;
                        segmentationQuestion.Keypad4Description = createQuestionsDTO.SegmentationQuestion.Keypad4Description;
                        segmentationQuestion.Keypad5Description = createQuestionsDTO.SegmentationQuestion.Keypad5Description;
                        segmentationQuestion.Keypad6Description = createQuestionsDTO.SegmentationQuestion.Keypad6Description;
                        segmentationQuestion.Keypad7Description = createQuestionsDTO.SegmentationQuestion.Keypad7Description;
                        segmentationQuestion.Keypad8Description = createQuestionsDTO.SegmentationQuestion.Keypad8Description;
                        segmentationQuestion.Keypad9Description = createQuestionsDTO.SegmentationQuestion.Keypad9Description;
                        segmentationQuestion.QuestionId = questionId;
                        segmentationQuestion.CreatedBy = loggedInUserId;
                        segmentationQuestion.CreatedOn = DateTime.Now;
                        segmentationQuestion.UpdatedBy = loggedInUserId;
                        segmentationQuestion.UpdatedOn = DateTime.Now;
                        await _dbContext.AddAsync(segmentationQuestion);
                        await _dbContext.SaveChangesAsync();
                    }

                    // saving question translations into default langauge i.e English
                    QuestionTranslation questionTranslation = new QuestionTranslation();
                    questionTranslation.QuestionId = questionId;
                    questionTranslation.LanguageId = languageId;
                    questionTranslation.Translation = createQuestionsDTO.QuestionText;
                    questionTranslation.CreatedBy = loggedInUserId;
                    questionTranslation.CreatedOn = DateTime.Now;
                    questionTranslation.UpdatedBy = loggedInUserId;
                    questionTranslation.UpdatedOn = DateTime.Now;
                    await _dbContext.AddAsync(questionTranslation);
                    await _dbContext.SaveChangesAsync();

                    responseModel.Id = questionId;
                    response.Message = "Question created successfully.";
                    transaction.Commit();
                    response.Data = responseModel;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    var message = ex.Message;
                    var functionName = "CreateQuestions";
                    _logger.LogError($"Error: {functionName} | {message}");
                    throw new Exception(message);
                }
            }
            return response;
        }

        /// <summary>
        /// This method is used to fetch the list of questions with pagination.
        /// </summary>
        public async Task<PagingHelper<GetQuestionsList>> GetQuestionsList(SearchingDTO paginationDTO)
        {
            try
            {
                IEnumerable<GetQuestionsList> getQuestionsLists = (from ques in _dbContext.Questions
                                                                   join quesTrans in _dbContext.QuestionTranslation on ques.QuestionId equals quesTrans.QuestionId into QuestionTranslations
                                                                   from qt in QuestionTranslations.DefaultIfEmpty()
                                                                   join quesAds in _dbContext.QuestionAudio on new 
                                                                   { ques.QuestionId, qt.LanguageId } equals new { quesAds.QuestionId, quesAds.LanguageId } into QuestionAudios
                                                                   from qa in QuestionAudios.DefaultIfEmpty()
                                                                   where ques.IsArchived == false
                                                                   select new GetQuestionsList
                                                                   {
                                                                       QuestionId = ques.QuestionId,
                                                                       QuestionText = ques.QuestionText,
                                                                       HasAudio = qa.AudioUrl == null ? false : true,
                                                                   }).ToList();

                SearchBy(ref getQuestionsLists, paginationDTO.SearchValue);

                var getQuestionsList = getQuestionsLists.AsQueryable();

                // for sorting questions list
                getQuestionsList = SortHelper<GetQuestionsList>.ApplySort(getQuestionsList, paginationDTO.OrderBy);

                // for pagination in questions list
                var results = PagingHelper<GetQuestionsList>.ToPagedList(getQuestionsList, paginationDTO.PageNumber, paginationDTO.PageSize);

                return results;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                var functionName = "GetQuestionsList";
                _logger.LogError($"Error: {functionName} | {message}");
                throw new Exception(message);
            }
        }

        /// <summary>
        /// This method is used to fetch searching records by Question Text from questions list.
        /// </summary>
        private void SearchBy(ref IEnumerable<GetQuestionsList> getQuestionsLists, string? SearchValue)
        {
            try
            {
                if (!getQuestionsLists.Any() || string.IsNullOrWhiteSpace(SearchValue))
                    return;
                getQuestionsLists = getQuestionsLists.Where(o => o.QuestionText.ToLower().Contains(SearchValue.Trim().ToLower()) ||
                o.QuestionText.ToLower().Contains(SearchValue.Trim().ToLower()));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}