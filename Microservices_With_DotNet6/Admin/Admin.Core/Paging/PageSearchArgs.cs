using System.Collections.Generic;

namespace Admin.Core.Paging
{
    public class PageSearchArgs
    {
        public int PageIndex { get; set; }

        public int PageSize { get; set; }

        public PagingStrategy PagingStrategy { get; set; }

        public List<SortingOption> SortingOptions { get; set; }

        public List<FilteringOption> FilteringOptions { get; set; }
    }
}
