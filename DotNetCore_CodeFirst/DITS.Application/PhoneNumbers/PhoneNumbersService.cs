using DITS.Core.DTOs.Common.Response;
using DITS.Core.DTOs.PhoneNumbers.Request;
using DITS.Core.DTOs.PhoneNumbers.Response;
using DITS.Core.Interfaces.PhoneNumbers;
using DITS.Services.PhoneNumbers.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Services.PhoneNumbers
{
    public class PhoneNumbersService : IPhoneNumbersService
    {
        private readonly IPhoneNumbersRepository _phoneNumbersRepository;
        public PhoneNumbersService(IPhoneNumbersRepository phoneNumbersRepository)
        {
            _phoneNumbersRepository = phoneNumbersRepository;
        }

        public DownloadWorkerPhoneNumberResponse DownloadWorkersPhoneNumber(Guid organisationSiteId)
            => _phoneNumbersRepository.DownloadWorkersPhoneNumber(organisationSiteId);
    }
}
