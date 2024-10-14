using HttpAggregator.Services;
using HttpAggregator.ValueObjects;
using Microsoft.AspNetCore.Mvc;

namespace HttpAggregator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IHomeService _homeService;
        public HomeController(IHomeService homeService)
        {
            _homeService = homeService;
        }
        [HttpGet("GetProducts")]
        public async Task<IActionResult> GetProducts()
        {
            return Ok(await _homeService.GetProducts());
        }
    }
}