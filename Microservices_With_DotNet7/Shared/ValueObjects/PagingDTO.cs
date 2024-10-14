using Shared.Utilities;

namespace Shared.ValueObjects
{
    public class PagingDTO
    {
        public int PageNo { get; set; } = 1;
        public int PageSize { get; set; } = 100;
        public string OrderBy { get; set; } = Sorting.CreatedOn;
        public string OrderType { get; set; } = Sorting.ASC;
    }
}