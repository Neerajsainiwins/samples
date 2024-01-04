using BCommerce.CommonService.API.Queries.City;
using BCommerce.KeyCloak.API.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BCommerce.KeyCloak.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;
        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("GetToken")]
        public async Task<IActionResult> GetToken([FromQuery] KeycloakUserDto keycloakUserDto)
        {
            try
            {
                return new OkObjectResult(await _mediator.Send(new GetTokenQuery(keycloakUserDto)));
            }
            catch (KeycloakExceptionDto)
            {
                return Unauthorized("Authorization has failed!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        } 
        
        [HttpGet("GetRefreshToken")]
        public async Task<IActionResult> GetRefreshToken([FromQuery] RefreshTokenDto refreshTokenDto)
        {
            try
            {
                return new OkObjectResult(await _mediator.Send(new GetRefreshTokenQuery(refreshTokenDto)));
            }
            catch (KeycloakExceptionDto)
            {
                return BadRequest("Invalid refreshtoken");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}