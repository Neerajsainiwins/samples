using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace WebGateway.CustomAggregates
{
    [Route("[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [Route("[action]")]
        [HttpGet]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public string Testing()
        {
            return "Gateway is working";
        }
    }
}
