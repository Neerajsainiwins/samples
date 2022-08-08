using DITS.Core.DTOs.Common.Response;
using DITS.Core.DTOs.Common.Ṛesponse;
using DITS.Core.DTOs.PhoneNumbers.Request;
using DITS.Core.DTOs.PhoneNumbers.Response;
using DITS.Core.Interfaces.PhoneNumbers;
using DITS.Core.Organisations;
using DITS.Infrastucture.Data;
using Microsoft.Extensions.Logging;
using System.Data;
using System.Data.Entity;

namespace DITS.Infrastucture.Repositories.PhoneNumbers
{
    public class PhoneNumbersRepository : IPhoneNumbersRepository
    {
        private readonly Context _dbContext;
        private readonly ILogger<PhoneNumbersRepository> _logger;
        public PhoneNumbersRepository(Context dbContext, ILogger<PhoneNumbersRepository> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        /// <summary>
        /// This method is used to download workers phone numbers of an organisation site.
        /// </summary>
        public DownloadWorkerPhoneNumberResponse DownloadWorkersPhoneNumber(Guid organisationSiteId)
        {
            try
            {
                DownloadWorkerPhoneNumberResponse response = new DownloadWorkerPhoneNumberResponse();

                response.Data = _dbContext.OrganisationSiteWorkers.Where(x => x.OrganisationSiteId == organisationSiteId).AsNoTracking().Select(x => new WorkerPhoneNumberModel
                { PhoneNumber = x.PhoneNumber }).ToList();
                return response;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                var functionName = "DownloadWorkersPhoneNumber";
                _logger.LogError($"Error: {functionName} | {message}");
                throw new Exception(message);
            }
        }      
    }
}
