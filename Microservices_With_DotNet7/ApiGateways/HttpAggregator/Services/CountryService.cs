using HttpAggregator.Utilities;
using HttpAggregator.ValueObjects;

namespace HttpAggregator.Services
{
    public class CountryService : ICountryService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private  readonly string _commonBaseAddress = string.Empty;
        public CountryService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _commonBaseAddress = _configuration["CommonBaseAddress"];
        }

        public async Task<string> GetCountryById(int countryId)
        {
            string apiUrl = string.Format("{0}{1}", _commonBaseAddress, $"api/Country/GetById/{countryId}");

            HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);

            if (response.IsSuccessStatusCode)
            {
                string responseData = await response.Content.ReadAsStringAsync();

                Console.WriteLine("Response Data: " + responseData);

                return responseData;
            }
            else
            {
                Console.WriteLine($"Error: {response.StatusCode} - {response.ReasonPhrase}");
                return response.ReasonPhrase;
            }
        }

        public async Task<string> CreateCountry(CreateCountryDto country)
        {
            string apiUrl = string.Format("{0}{1}", _commonBaseAddress, "api/Country/Create");

            var request = new HttpRequestMessage(HttpMethod.Post, apiUrl)
            {
                Content = JsonContent.Create(country)
            };
            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                response.EnsureSuccessStatusCode();
                return Constants.SavedCountry;
            }
            else
                return response.ReasonPhrase;
        }
    }
}
