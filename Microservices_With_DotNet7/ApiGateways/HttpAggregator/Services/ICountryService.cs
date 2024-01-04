using HttpAggregator.Models;
using HttpAggregator.ValueObjects;

namespace HttpAggregator.Services
{
    public interface ICountryService
    {
        Task<string> GetCountryById(int countryId);
        Task<string> CreateCountry(CreateCountryDto country);
    }
}