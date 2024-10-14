using HttpAggregator.Utilities;
using HttpAggregator.ValueObjects;

namespace HttpAggregator.Services.Implementation
{
    public class HomeService:IHomeService
    {
        private readonly RedisCacheHandler _cache;
        private readonly HttpClient _productshttpClient;
        public HomeService(RedisCacheHandler cache)
        {
            _cache = cache;
            _productshttpClient = DaprClient.CreateInvokeHttpClient(DaprServices.ProductService);
        }

        public async Task<List<DropdownDTO>> GetProducts()
        {
            return await ApiResponse<List<DropdownDTO>>.FetchDataAsync(_productshttpClient, $"/api/Product/GetProducts");

        }
    }
}