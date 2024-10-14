using HttpAggregator.Models;
using HttpAggregator.ValueObjects;

namespace HttpAggregator.Services.Interface
{
    public interface IHomeService
    {
        Task<List<DropdownDTO>> GetProducts();
    }
}