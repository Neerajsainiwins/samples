using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.DTOs.Questions.Response
{
    public class GetIndicatorsResponse
    {
        public IEnumerable<GetIndicatorsModel> Data { get; set; }
    }

    public class GetIndicatorsModel
    {
        public Guid IndicatorId { get; set; }
        public string IndicatorLabel { get; set; }
        public Guid IndicatorFamilyId { get; set; }
    }
}
