using DITS.Core.DTOs.PhoneNumbers.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.DTOs.PhoneNumbers.Response
{
    public class DownloadWorkerPhoneNumberResponse
    {
        public List<WorkerPhoneNumberModel> Data { get; set; }
    }
}
