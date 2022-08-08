using DITS.Core.DTOs.DetailedResults;
using DITS.Core.DTOs.Priorities;
using DITS.Core.DTOs.Reports.Request;
using DITS.Core.DTOs.Reports.Response;
using DITS.Core.DTOs.ResponseRates;
using DITS.Core.Interfaces.Reports;
using DITS.Core.Interfaces.ResponseRates;
using DITS.Core.ViewModel.Organisation;
using DITS.Infrastucture.Data;
using Microsoft.Extensions.Logging;
using System.Data.Entity;
using System.Text.RegularExpressions;

namespace DITS.Infrastucture.Repositories.Reports
{
    public class ReportsRepository : IReportsRepository
    {
        private readonly Context _dbContext;
        private readonly IResponseRatesRepository _responseRatesRepository;
        private readonly ILogger<ReportsRepository> _logger;
        public ReportsRepository(Context dbContext,
                                 IResponseRatesRepository responseRatesRepository,
                                 ILogger<ReportsRepository> logger)
        {
            _dbContext = dbContext;
            _responseRatesRepository = responseRatesRepository;
            _logger = logger;
        }

        /// <summary>
        /// This method is used to fetch the detailed report data of an organisation site.
        /// </summary>
        public async Task<GetSiteDetailedReportResponse> GetSiteDetailedReport(GetSiteDetailedReportDTO getSiteDetailedReportDTO)
        {
            try
            {
                GetSiteDetailedReportResponse response = new GetSiteDetailedReportResponse();
                IEnumerable<DataCyclePrioritiesDTO> priorities = new List<DataCyclePrioritiesDTO>();

                var progressDetailsList = new List<ProgressDetails>();
                var participantDetailsList = new List<DataCycleResponseRatesDTO>();
                var detailedResultList = new List<DataCycleDetailedResultsDTO>();

                int prioritiesCount = 0;
                response.Data = (from osr in _dbContext.OrganisationSurveyResponse
                                 join orgSite in _dbContext.OrganisationSites on osr.OrganisationSiteId equals orgSite.OrganisationSiteId into sites
                                 from os in sites.DefaultIfEmpty()
                                 where osr.OrganisationSiteId == getSiteDetailedReportDTO.SiteId
                                 select new GetSiteDetailedReportModel
                                 {
                                     Site = osr.OrganisationSiteId,
                                     SiteName = os.OrganisationSiteName
                                 }).FirstOrDefault();

                // fetching data cycles of an organisation site
                var dataCycleIds = _dbContext.OrganisationSurveyResponse.Where(x => x.OrganisationSiteId == getSiteDetailedReportDTO.SiteId).AsNoTracking().Select(x => x.DataCycleId).Distinct().ToList();

                foreach (var dataCycleId in dataCycleIds)
                {
                    priorities = GetDataCyclePriorities(dataCycleId, getSiteDetailedReportDTO);
                    prioritiesCount = GetPrioritiesCount(dataCycleId, getSiteDetailedReportDTO);
                    var progressDetails = GetSitesProgress(dataCycleId, getSiteDetailedReportDTO);
                    progressDetailsList.Add(progressDetails);
                    var participantDetails = await _responseRatesRepository.GetDataCycleResponseRatesByIdAsync(dataCycleId);
                    foreach (var participant in participantDetails)
                        participantDetailsList.Add(participant);
                    var detailedResultDetails = GetDataCycleDetailedResults(dataCycleId, getSiteDetailedReportDTO);
                    foreach (var detailedResult in detailedResultDetails)
                        detailedResultList.Add(detailedResult);
                }

                var priorityDetails = new PriorityDetails
                {
                    PrioritiesCount = prioritiesCount,
                    Priorities = priorities,
                };

                //  assigning values to response model
                var siteDetails = new SiteDetails
                {
                    PriorityDetails = priorityDetails,
                    ProgressDetails = progressDetailsList,
                    ParticipantDetails = participantDetailsList,
                    DetailedResult = detailedResultList
                };

                response.Data.SiteDetails = siteDetails;

                return response;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                var functionName = "GetSiteDetailedReport";
                _logger.LogError($"Error: {functionName} | {message}");
                throw new Exception(message);
            }
        }

        /// <summary>
        /// This method is used to fetch participantId from segmentationFilter model.
        /// </summary>
        private List<Guid> GetFilteredParticipantsList(Guid dataCycleId, GetSiteDetailedReportDTO getSiteDetailedReportDTO)
        {
            try
            {
                var participantsFilter = new Filter();
                var participantsList = new List<Filter>();
                var codedResponseList = new List<int>();

                // to add true filtered data values into codedResponse list
                foreach (var filteredData in getSiteDetailedReportDTO.SegmentationFilters)
                {
                    if (filteredData.Keypad1Description == true)
                        codedResponseList.Add(Convert.ToInt32(Regex.Replace("Keypad1Description", "[^0-9]", "")));
                    if (filteredData.Keypad2Description == true)
                        codedResponseList.Add(Convert.ToInt32(Regex.Replace("Keypad2Description", "[^0-9]", "")));
                    if (filteredData.Keypad3Description == true)
                        codedResponseList.Add(Convert.ToInt32(Regex.Replace("Keypad3Description", "[^0-9]", "")));
                    if (filteredData.Keypad4Description == true)
                        codedResponseList.Add(Convert.ToInt32(Regex.Replace("Keypad4Description", "[^0-9]", "")));
                    if (filteredData.Keypad5Description == true)
                        codedResponseList.Add(Convert.ToInt32(Regex.Replace("Keypad5Description", "[^0-9]", "")));
                    if (filteredData.Keypad6Description == true)
                        codedResponseList.Add(Convert.ToInt32(Regex.Replace("Keypad6Description", "[^0-9]", "")));
                    if (filteredData.Keypad7Description == true)
                        codedResponseList.Add(Convert.ToInt32(Regex.Replace("Keypad7Description", "[^0-9]", "")));
                    if (filteredData.Keypad8Description == true)
                        codedResponseList.Add(Convert.ToInt32(Regex.Replace("Keypad8Description", "[^0-9]", "")));
                    if (filteredData.Keypad9Description == true)
                        codedResponseList.Add(Convert.ToInt32(Regex.Replace("Keypad9Description", "[^0-9]", "")));

                    participantsFilter = _dbContext.OrganisationSurveyResponse
                                       .Join(_dbContext.SegmentationQuestions, osr => osr.QuestionId, sg => sg.QuestionId, (osr, sg) => new { osr, sg })
                                       .Where(x => x.osr.DataCycleId == dataCycleId && x.osr.IsSegmentationQuestion == true && x.sg.SegmentationQuestionId == filteredData.SegmentationQuestionId &&
                                        codedResponseList.Contains(x.osr.CodedResponse))
                                       .AsNoTracking()
                                       .Select(x => new Filter { SegmentationQuestionId = x.sg.SegmentationQuestionId, ParticipantId = x.osr.ParticipantId }).Distinct().FirstOrDefault();
                    if (participantsFilter != null)
                        participantsList.Add(participantsFilter);
                }

                // fetching participantId from participantsList
                var filteredList = participantsList.GroupBy(x => x.ParticipantId)
                                           .Select(x => new
                                           {
                                               ParticipantId = x.Key,
                                               Count = x.Count()
                                           }).ToList();

                filteredList.Where(x => x.Count > 1).Select(x => x.ParticipantId).ToList();

                List<Guid> res = filteredList.Select(x => x.ParticipantId).ToList();
                return res;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                var functionName = "GetFilteredParticipantsList";
                _logger.LogError($"Error: {functionName} | {message}");
                throw new Exception(message);
            }
        }

        /// <summary>
        /// This method is used to fetch priorities data of the an organisation site by datacycleId.
        /// </summary>
        private IEnumerable<DataCyclePrioritiesDTO> GetDataCyclePriorities(Guid dataCycleId, GetSiteDetailedReportDTO getSiteDetailedReportDTO)
        {
            try
            {
                var res = GetFilteredParticipantsList(dataCycleId, getSiteDetailedReportDTO);

                // fetching the list of questions details of data cycle
                var orgSurveyResponses = (from osr in _dbContext.OrganisationSurveyResponse
                                          join dcps in _dbContext.DataCycleParticipantSummary on osr.DataCycleId equals dcps.DataCycleId into dataCycleSummary
                                          from dcs in dataCycleSummary.DefaultIfEmpty()
                                          join dtcyc in _dbContext.DataCycle on osr.DataCycleId equals dtcyc.DataCycleId into dataCycle
                                          from dc in dataCycle.DefaultIfEmpty()
                                          where osr.IsSegmentationQuestion == false && osr.IsConsentQuestion == false && osr.DataCycleId == dataCycleId && osr.Question != "Other"
                                          select new
                                          {
                                              DataCycleId = osr.DataCycleId,
                                              DataCycleName = dc.DataCycleName,
                                              QuestionId = osr.QuestionId,
                                              Description = osr.Question,
                                              CodedResponse = osr.CodedResponse,
                                              CompletedDate = osr.CompletedDate
                                          }).ToList();

                // grouping organisation survey response list on the basis of decsription
                var questionResponses = orgSurveyResponses.GroupBy(x => x.Description)
                                    .Select(x => new
                                    {
                                        CallCycleName = x.Select(x => x.DataCycleName).FirstOrDefault(),
                                        QuestionId = x.Select(x => x.QuestionId).FirstOrDefault(),
                                        CompletedDate = x.Select(x => x.CompletedDate).FirstOrDefault(),
                                        Description = x.Select(d => d.Description).FirstOrDefault(),
                                        PositiveCount = _dbContext.OrganisationSurveyResponse.Where(x => x.DataCycleId == dataCycleId && x.CodedResponse == 1
                                                        && res.Contains(x.ParticipantId)).Select(x => x.CodedResponse).Count(),
                                        NegativeCount = _dbContext.OrganisationSurveyResponse.Where(x => x.DataCycleId == dataCycleId && x.CodedResponse == -1
                                                        && res.Contains(x.ParticipantId)).Select(x => x.CodedResponse).Count(),
                                        NeutralCount = _dbContext.OrganisationSurveyResponse.Where(x => x.DataCycleId == dataCycleId && x.CodedResponse == 0
                                                        && res.Contains(x.ParticipantId)).Select(x => x.CodedResponse).Count()
                                    }).ToList();

                var priorities = new List<DataCyclePrioritiesDTO>();

                foreach (var questionResponse in questionResponses)
                {
                    var sumCounts = questionResponse.PositiveCount + questionResponse.NegativeCount + questionResponse.NeutralCount;

                    if (sumCounts > 0)
                    {
                        // to fetch the percentage of counts
                        var negFraction = (Convert.ToDouble(questionResponse.NegativeCount) / Convert.ToDouble(sumCounts));
                        var negResponsePercentage = negFraction * 100;

                        var neutralFraction = (Convert.ToDouble(questionResponse.NeutralCount) / Convert.ToDouble(sumCounts));
                        var neutralResponsePercentage = neutralFraction * 100;

                        var posFraction = (Convert.ToDouble(questionResponse.PositiveCount) / Convert.ToDouble(sumCounts));
                        var posResponsePercentage = posFraction * 100;

                        if (negResponsePercentage >= 50)
                        {
                            // assigning values to response model 
                            var priority = new DataCyclePrioritiesDTO
                            {
                                DataCycleId = dataCycleId,
                                DataCycleName = questionResponse.CallCycleName,
                                QuestionId = questionResponse.QuestionId,
                                CompletedDate = questionResponse.CompletedDate,
                                Description = questionResponse.Description,
                                NegPercentage = Math.Round(negResponsePercentage, 2),
                                NeutralPercentage = Math.Round(neutralResponsePercentage, 2),
                                PosPercentage = Math.Round(posResponsePercentage, 2)
                            };

                            priorities.Add(priority);
                        }
                    }
                }

                return priorities;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                var functionName = "GetDataCyclePriorities";
                _logger.LogError($"Error: {functionName} | {message}");
                throw new Exception(message);
            }
        }

        /// <summary>
        /// This method is used to fetch the segmentation questions of an organisation site for filters.
        /// </summary>
        public GetSegmentationQuestionsResponse GetSegmentationQuestions(Guid organisationSiteId)
        {
            GetSegmentationQuestionsResponse response = new GetSegmentationQuestionsResponse();
            var res = new List<GetSegmentationQuestionsModel>();
            try
            {
                response.Data = (from osr in _dbContext.OrganisationSurveyResponse
                                 join segques in _dbContext.SegmentationQuestions on osr.QuestionId equals segques.QuestionId into segQuestions
                                 from sq in segQuestions.DefaultIfEmpty()
                                 where osr.OrganisationSiteId == organisationSiteId && osr.IsSegmentationQuestion == true
                                 group sq by new
                                 {
                                     sq.SegmentationQuestionId,
                                     sq.QuestionId,
                                     sq.ChartTitle,
                                     sq.Keypad1Description,
                                     sq.Keypad2Description,
                                     sq.Keypad3Description,
                                     sq.Keypad4Description,
                                     sq.Keypad5Description,
                                     sq.Keypad6Description,
                                     sq.Keypad7Description,
                                     sq.Keypad8Description,
                                     sq.Keypad9Description
                                 } into grouped
                                 select new GetSegmentationQuestionsModel
                                 {
                                     SegmentationQuestionId = grouped.Key.SegmentationQuestionId,
                                     QuestionId = grouped.Key.QuestionId,
                                     ChartTitle = grouped.Key.ChartTitle,
                                     Keypad1Description = grouped.Key.Keypad1Description,
                                     Keypad2Description = grouped.Key.Keypad2Description,
                                     Keypad3Description = grouped.Key.Keypad3Description,
                                     Keypad4Description = grouped.Key.Keypad4Description,
                                     Keypad5Description = grouped.Key.Keypad5Description,
                                     Keypad6Description = grouped.Key.Keypad6Description,
                                     Keypad7Description = grouped.Key.Keypad7Description,
                                     Keypad8Description = grouped.Key.Keypad8Description,
                                     Keypad9Description = grouped.Key.Keypad9Description
                                 }).ToList();
                response.Data.RemoveAll(x => x.QuestionId == null);

                return response;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                var functionName = "GetSegmentationQuestions";
                _logger.LogError($"Error: {functionName} | {message}");
                throw new Exception(message);
            }
        }
    }
}
