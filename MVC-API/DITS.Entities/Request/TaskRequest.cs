using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Entities.Request
{
  public   class TaskRequest
    {
        public int TaskId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime? ScheduleStartDateTime { get; set; }
        public DateTime? ScheduleEndDateTime { get; set; }
        public int AssignedBy { get; set; }
        public int Priority { get; set; }
        public int Status { get; set; }
        public int PercentageComplete { get; set; }
        public DateTime? StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public int? PredecessorTask { get; set; }
        public int RoleType { get; set; }
        public string Prioritys { get; set; }
        public string Subject { get; set; }
    }


    public class CreateTaskRequest
    {
        public TaskRequest data { get; set; }
    }
}
