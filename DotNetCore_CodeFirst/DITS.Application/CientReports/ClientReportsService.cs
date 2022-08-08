using DITS.Application.CientReports.Interfaces;
using DITS.Core.Interfaces.ClientReports;

namespace DITS.Application.CientReports
{
    public class ClientReportsService : IClientReportsService
    {
        private readonly IClientReportsRepository _clientReportsRepository;

        public ClientReportsService(IClientReportsRepository clientReportsRepository)
        {
            _clientReportsRepository = clientReportsRepository;
        }

        public async Task<bool> ValidateClientAccess(Guid organisationId, Guid dataCycleId, string dataCycleName)
            => await _clientReportsRepository.ValidateClientAccess(organisationId, dataCycleId, dataCycleName);
        public async Task<int> GetNumberOfDataCycleParticipantsById(Guid dataCycleId)
            => await _clientReportsRepository.GetNumberOfDataCycleParticipantsById(dataCycleId);
        public async Task<int> GetNumberOfDataCycleParticipantsByName(string dataCycleName)
            => await _clientReportsRepository.GetNumberOfDataCycleParticipantsByName(dataCycleName);
    }
}
