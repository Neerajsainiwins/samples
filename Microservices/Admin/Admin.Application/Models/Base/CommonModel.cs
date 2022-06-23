using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Admin.Application.Models.Base
{
    public class CommonModel
    {
        public bool IsActive { get; set; } = true;

        public bool IsDeleted { get; set; } = false;

        public DateTime? CreatedOn { get; set; }=DateTime.Now;

        public int? CreatedBy { get; set; } = 0;

        public DateTime? ModifiedOn { get; set; } = DateTime.Now;

        public int? ModifiedBy { get; set; } = 0;

        public DateTime? DeletedOn { get; set; } = DateTime.Now;

        public int? DeletedBy { get; set; } = 0;
    }   
}
