using KeyCloak.API.Command.Create;
using KeyCloak.API.Command.Delete;
using KeyCloak.API.Command.Update;
using KeyCloak.API.IntegrationEvents;
using KeyCloak.API.Queries;
using Dapr;
using Microsoft.AspNetCore.Mvc;

namespace KeyCloak.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : BaseController
    {
        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetAll()
        {
            return new OkObjectResult(await Mediator.Send(new GetUsersQuery()));
        }

        [HttpGet("GetUserById/{userId}")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            return new OkObjectResult(await Mediator.Send(new GetUserByIdQuery(userId)));
        }

    }
}