namespace DITS.Application.CientReports.Interfaces
{
    public interface IClientReportsService
    {
        Task<bool> ValidateClientAccess(Guid organisationId, Guid dataCycleId, string dataCycleName);
        Task<int> GetNumberOfDataCycleParticipantsById(Guid dataCycleId);
        Task<int> GetNumberOfDataCycleParticipantsByName(string dataCycleName);
    }
}
