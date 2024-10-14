using CommonService.API.Queries.Country;
using Shared.Utilities;
using Shared.ValueObjects;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommonService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<CountryController> _logger;
        public CountryController(IMediator mediator, ILogger<CountryController> logger)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateCountryDto createCountryDto)
        {
            _logger.LogInformation(LogMessages.CreateCountry);
            int countryId = await _mediator.Send(new CreateCountryCommand(createCountryDto));
            if (countryId < 1)
                ExceptionHelper.ThrowCustomException(LogMessages.CreateCountry);

            return Ok();
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation(LogMessages.DeleteCountry);
            bool isDeleted = await _mediator.Send(new DeleteCountryCommand(id));
            if (!isDeleted)
                ExceptionHelper.ThrowCustomException(LogMessages.DeleteCountry);

            return Ok();
        }

    }
}
