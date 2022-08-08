using DITS.Core.DTOs.Reports.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.DTOs.Reports.Request
{
    public class GetSiteDetailedReportDTO
    {
        public Guid SiteId { get; set; }
        public int SelectedCallCycleTypeCode { get; set; }
        public List<GetSegmentationQuestionsDTO>? SegmentationFilters { get; set; }
    }
    public class GetSegmentationQuestionsDTO
    {
        public Guid? SegmentationQuestionId { get; set; }
        public Guid? QuestionId { get; set; }
        public string? ChartTitle { get; set; }
        public bool? Keypad1Description { get; set; }
        public bool? Keypad2Description { get; set; }
        public bool? Keypad3Description { get; set; }
        public bool? Keypad4Description { get; set; }
        public bool? Keypad5Description { get; set; }
        public bool? Keypad6Description { get; set; }
        public bool? Keypad7Description { get; set; }
        public bool? Keypad8Description { get; set; }
        public bool? Keypad9Description { get; set; }
    }
}
