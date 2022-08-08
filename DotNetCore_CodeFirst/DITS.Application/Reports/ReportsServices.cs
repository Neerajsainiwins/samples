using DITS.Core.DTOs.Reports.Request;
using DITS.Core.DTOs.Reports.Response;
using DITS.Core.Interfaces.Reports;
using DITS.Services.Reports.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Services.Reports
{
    public class ReportsServices : IReportsService
    {
        private readonly IReportsRepository _reportsRepository;
        public ReportsServices(IReportsRepository reportsRepository)
        {
            _reportsRepository = reportsRepository;
        }

        public async Task<GetSiteDetailedReportResponse> GetSiteDetailedReport(GetSiteDetailedReportDTO getSiteDetailedReportDTO)
            => await _reportsRepository.GetSiteDetailedReport(getSiteDetailedReportDTO);

        public GetSurveyTemplatesForOrganisationSiteResponse GetSurveyTemplatesOfOrganisation(Guid organisationSiteId)
            => _reportsRepository.GetSurveyTemplatesOfOrganisation(organisationSiteId);

        public GetDataCycleForOrganisationSiteResponse GetDataCycleOfOrganisation(Guid organisationSiteId)
            => _reportsRepository.GetDataCycleOfOrganisation(organisationSiteId);

        public GetSegmentationQuestionsResponse GetSegmentationQuestions(Guid organisationSiteId)
            => _reportsRepository.GetSegmentationQuestions(organisationSiteId);
    }
}
