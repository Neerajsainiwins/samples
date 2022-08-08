using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace WebGateway.CustomAggregates
{
    [ApiController]
    [Route("[controller]")]
    public class BaseController : ControllerBase
    {
        [Route("[action]")]
        [HttpGet]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public string Status()
        {
            return "App is live now at " + HttpContext.Request.Host;
        }
    }
}
