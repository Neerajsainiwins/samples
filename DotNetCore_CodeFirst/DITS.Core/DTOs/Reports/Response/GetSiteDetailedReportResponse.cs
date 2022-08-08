using DITS.Core.DTOs.DetailedResults;
using DITS.Core.DTOs.Priorities;
using DITS.Core.DTOs.ResponseRates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.DTOs.Reports.Response
{
    public class GetSiteDetailedReportResponse
    {
        public GetSiteDetailedReportModel? Data { get; set; }
    }

    public class GetSiteDetailedReportModel
    {
        public Guid Site { get; set; }
        public string SiteName { get; set; }
        public SiteDetails? SiteDetails { get; set; }
    }

    public class SiteDetails
    {
        public PriorityDetails? PriorityDetails { get; set; }
        public IEnumerable<ProgressDetails>? ProgressDetails { get; set; }
        public IEnumerable<DataCycleResponseRatesDTO>? ParticipantDetails { get; set; }
        public IEnumerable<DataCycleDetailedResultsDTO>? DetailedResult { get; set; }
    }

    public class PriorityDetails
    {
        public int PrioritiesCount { get; set; }
        public IEnumerable<DataCyclePrioritiesDTO>? Priorities { get; set; }
    }

    public class DataCyclePrioritiesModel : DataCycleModel
    {
        public string Description { get; set; }
        public double NegPercentage { get; set; }
        public double NeutralPercentage { get; set; }
        public double PosPercentage { get; set; }
        public Guid QuestionId { get; set; }
    }

    public class DataCycleModel
    {
        public Guid DataCycleId { get; set; }
        public string DataCycleName { get; set; }
        public DateTime CompletedDate { get; set; }
    }

    public class ProgressDetails : DataCycleModel
    {
        public double NegPercentage { get; set; }
        public double NeutralPercentage { get; set; }
        public double PosPercentage { get; set; }
        public decimal? SiteRating { get; set; }
    }
    public class Filter
    {
        public Guid SegmentationQuestionId { get; set; }
        public Guid ParticipantId { get; set; }
    }
}
