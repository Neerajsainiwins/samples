﻿namespace Admin.Core.Paging
{
    public class PagingArgs
    {
        public int PageIndex { get; set; }

        public int PageSize { get; set; }

        public PagingStrategy PagingStrategy { get; set; }
    }
}
