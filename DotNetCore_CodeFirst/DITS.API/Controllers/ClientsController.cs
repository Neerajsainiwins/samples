using DITS.API.Filters;
using DITS.Application.CientReports.Interfaces;
using DITS.Application.DetailedResults.Interfaces;
using DITS.Application.Priorities.Interfaces;
using DITS.Application.ResponseRates.Interfaces;
using DITS.Application.Sites.Interfaces;
using DITS.Application.SiteSummary.Interfaces;
using DITS.Core.DTOs.Priorities;
using DITS.Core.DTOs.ResponseRates;
using DITS.Core.DTOs.Sites;
using DITS.Core.Helpers;
using DITS.Core.ViewModel.OrganisationSites;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DITS.API.Controllers
{
    [ApiKeyAuth]
    [Route("v1/reports")]
    [ApiVersion("1.0")]
    [ApiController]
    public class ClientsController : BaseController
    {
        private readonly IClientReportsService _clientReportsService;
        private readonly ISiteDetailsService _siteDetailsService;
        private const string OrganisationIdHeaderName = "OrganisationId";

        public ClientsController(IClientReportsService clientReportsService,
            ISiteDetailsService siteDetailsService, IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
            _clientReportsService = clientReportsService;
            _siteDetailsService = siteDetailsService;
        }

        [HttpGet]
        [Route("priorities")]
        public async Task<IActionResult> GetDataCyclePriorities(Guid dataCycleId, string dataCycleName)
        {
            //Access Validation
            //This is necessarry to ensure that a client
            //has access to their organisations ONLY
            Request.Headers.TryGetValue(OrganisationIdHeaderName, out var validOrganisationId);

            var canClientAccessReport = false;

            if (string.IsNullOrEmpty(validOrganisationId))
                return BadRequest("Please provide a valid OrganisationId.");
            else
                canClientAccessReport = await _clientReportsService.ValidateClientAccess(Guid.Parse(validOrganisationId), dataCycleId, dataCycleName);


            if (!canClientAccessReport)
                return Unauthorized("Your organisation is forbidden access to the data cycle.");

            var participants = dataCycleId != Guid.Empty ? await _clientReportsService.GetNumberOfDataCycleParticipantsById(dataCycleId)
                : await _clientReportsService.GetNumberOfDataCycleParticipantsByName(dataCycleName);

            if (participants < 30)
                return BadRequest("There are less than 30 participants. You cannot retrieve data for this data cycle.");

            IEnumerable<DataCyclePrioritiesDTO> priorities;

            if (dataCycleId != Guid.Empty )
                priorities = await _prioritiesService.GetDataCyclePrioritiesAsync(dataCycleId);
            else
                priorities = await _prioritiesService.GetDataCyclePrioritiesByNameAsync(dataCycleName);


            var jsonResponse = JsonConvert.SerializeObject(priorities);

            return Ok(jsonResponse);
        }

     
    }
}
