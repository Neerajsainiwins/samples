using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Authentication.Models.SuperAdminModels
{
    public class SearchDTO
    {
        [Required]
        public int PageNo { get; set; } = 1;
        [Required]
        public int PageSize { get; set; }
        public string SearchValue { get; set; }
        public string SortColumn { get; set; }
        public string SortOrder { get; set; }
    }
}
