using DITS.Core.DTOs.Priorities;

namespace DITS.Core.Interfaces.ClientReports
{
    public interface IClientReportsRepository
    {
        Task<bool> ValidateClientAccess(Guid organisationId, Guid dataCycleId, string dataCycleName);
        Task<int> GetNumberOfDataCycleParticipantsById(Guid dataCycleId);
        Task<int> GetNumberOfDataCycleParticipantsByName(string dataCycleName);
        IEnumerable<DataCyclePrioritiesDTO> GetDataCyclePriorities(Guid dataCycleId);
    }
}
