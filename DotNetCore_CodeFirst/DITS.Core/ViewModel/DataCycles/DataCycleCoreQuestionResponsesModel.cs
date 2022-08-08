using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.ViewModel.DataCycles
{
    public class DataCycleCoreQuestionResponsesModel
    {
        public Guid DataCycleId { get; set; }
        public string DataCycleName { get; set; }
        public DateTime? CompletedDate { get; set; }
        public int PositiveCount { get; set; }
        public int NegativeCount { get; set; }
        public int NeutralCount { get; set; }
    }
}
