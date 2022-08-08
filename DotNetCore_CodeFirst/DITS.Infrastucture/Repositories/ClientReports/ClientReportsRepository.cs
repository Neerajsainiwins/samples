using DITS.Core.DTOs.Priorities;
using DITS.Core.Interfaces.ClientReports;
using DITS.Infrastucture.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DITS.Infrastucture.Repositories.ClientReports
{
    public class ClientReportsRepository : IClientReportsRepository
    {
        private readonly Context _context;
        private readonly ILogger<ClientReportsRepository> _logger;

        public ClientReportsRepository(Context context, ILogger<ClientReportsRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<bool> ValidateClientAccess(Guid organisationId, Guid dataCycleId, string dataCycleName)
        {
            try
            {
                var validated = false;

                if (dataCycleId != Guid.Empty)
                    validated = await _context.DataCycle.AnyAsync(x => x.DataCycleId == dataCycleId && x.OrganisationId == organisationId);
                else if (!string.IsNullOrEmpty(dataCycleName))
                    validated = await _context.DataCycle.AnyAsync(x => x.DataCycleName == dataCycleName && x.OrganisationId == organisationId);
                else
                    validated = false;


                var organisationSiteId = Guid.Empty;

                if (validated == false && dataCycleId != Guid.Empty)
                    organisationSiteId = await _context.DataCycle.Where(x => x.DataCycleId == dataCycleId).Select(x => x.OrganisationSiteId)
                        .SingleOrDefaultAsync();
                else if (validated == false && !string.IsNullOrEmpty(dataCycleName))
                    organisationSiteId = await _context.DataCycle.Where(x => x.DataCycleName == dataCycleName).Select(x => x.OrganisationSiteId)
                        .SingleOrDefaultAsync();

                if (organisationSiteId != Guid.Empty)
                    validated = await _context.OrganisationSiteLink.AnyAsync(x => x.OrganisationId == organisationId && x.OrganisationSiteId == organisationSiteId);

                return validated;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                var functionName = "ValidateClientAccess";
                _logger.LogError($"Error: {functionName} | {message}");
                throw new Exception(message);
            }
        }


        public async Task<int> GetNumberOfDataCycleParticipantsById(Guid dataCycleId)
        {
            try
            {
                var numberOfParticipants = await Task.Run(() => GetNumberOfDataCycleParticipants(dataCycleId));

                return numberOfParticipants;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                var functionName = "GetNumberOfDataCycleParticipantsById";
                _logger.LogError($"Error: {functionName} | {message}");
                throw new Exception(message);
            }
        }


    }
}
