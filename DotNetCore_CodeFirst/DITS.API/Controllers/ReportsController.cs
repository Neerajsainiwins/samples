using DITS.Core.DTOs.Reports.Request;
using DITS.Core.DTOs.Reports.Response;
using DITS.Services.Reports.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DITS.API.Controllers
{
    /// <summary>
    /// This controller is used to reports data.
    /// </summary>
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : BaseController
    {
        private readonly IReportsService _reportsService;
        public ReportsController(IReportsService reportsService, IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
            _reportsService = reportsService;
        }

        /// <summary>
        /// This method is used to fetch the detailed report data of an organisation site.
        /// </summary>
        [HttpPost]
        [Route("GetSiteDetailedReport")]
        public async Task<GetSiteDetailedReportResponse> GetSiteDetailedReport([FromBody] GetSiteDetailedReportDTO getSiteDetailedReportDTO)
            => await _reportsService.GetSiteDetailedReport(getSiteDetailedReportDTO);

        /// <summary>
        /// This method is used to fetch filters data of an organisation site.
        /// </summary>
        [HttpGet]
        [Route("GetSegmentationQuestions")]
        public GetSegmentationQuestionsResponse GetSegmentationQuestions(Guid organisationSiteId)
            => _reportsService.GetSegmentationQuestions(organisationSiteId);
    }
}
