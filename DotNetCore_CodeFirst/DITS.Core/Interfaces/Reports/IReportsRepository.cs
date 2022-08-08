using DITS.Core.DTOs.Reports.Request;
using DITS.Core.DTOs.Reports.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.Interfaces.Reports
{
    public interface IReportsRepository
    {
        Task<GetSiteDetailedReportResponse> GetSiteDetailedReport(GetSiteDetailedReportDTO getSiteDetailedReportDTO);
        GetSegmentationQuestionsResponse GetSegmentationQuestions(Guid organisationSiteId);
    }
}
