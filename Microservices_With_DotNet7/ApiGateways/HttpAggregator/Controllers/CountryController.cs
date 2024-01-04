using HttpAggregator.Services;
using HttpAggregator.ValueObjects;
using Microsoft.AspNetCore.Mvc;

namespace HttpAggregator.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class CountryController : ControllerBase
    {
        private readonly ICountryService _countryService;
        public CountryController(ICountryService countryService)
        {
            _countryService = countryService;
        }

        [HttpGet("GetCountryById/{countryId}")]
        public async Task<IActionResult> GetCountryById(int countryId)
        {
            string result = await _countryService.GetCountryById(countryId);
            if(string.IsNullOrEmpty(result))
                return NoContent();
           
            return Ok(result);
        }

        [HttpPost("CreateCountry")]
        public async Task<IActionResult> CreateCountry(CreateCountryDto country)
        {
            var result = await _countryService.CreateCountry(country);
            return Ok(result);
        }
    }
}