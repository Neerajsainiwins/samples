using System.Collections.Generic;

namespace Admin.Core.Paging
{
    public interface IPagedList<out T>
    {
        int PageIndex { get; }

        int PageSize { get; }

        int TotalCount { get; }

        int TotalPages { get; }

        bool HasPreviousPage { get; }

        bool HasNextPage { get; }

        IEnumerable<T> Items { get; }
    }
}
