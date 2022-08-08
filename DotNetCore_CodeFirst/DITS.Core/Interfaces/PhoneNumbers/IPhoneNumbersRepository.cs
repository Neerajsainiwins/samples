using DITS.Core.DTOs.Common.Response;
using DITS.Core.DTOs.PhoneNumbers.Request;
using DITS.Core.DTOs.PhoneNumbers.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.Interfaces.PhoneNumbers
{
    public interface IPhoneNumbersRepository
    {
        DownloadWorkerPhoneNumberResponse DownloadWorkersPhoneNumber(Guid organisationSiteId);
    }
}
