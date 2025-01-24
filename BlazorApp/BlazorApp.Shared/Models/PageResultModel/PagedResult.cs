using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazorApp.Shared.Models.PageResultModel
{
    public class PagedResult<T>
    {
        public IEnumerable<T> Data { get; set; }    
        public int PageIndex { get; set; }            
        public int PageSize { get; set; }          
        public int TotalPage { get; set; }
        public int TotalRecords { get; set; }      
    }

}
