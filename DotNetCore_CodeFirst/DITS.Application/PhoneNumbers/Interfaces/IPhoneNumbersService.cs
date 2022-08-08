using DITS.Core.DTOs.Common.Response;
using DITS.Core.DTOs.PhoneNumbers.Request;
using DITS.Core.DTOs.PhoneNumbers.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Services.PhoneNumbers.Interfaces
{
    public interface IPhoneNumbersService
    {
        DownloadWorkerPhoneNumberResponse DownloadWorkersPhoneNumber(Guid organisationSiteId);
    }
}
