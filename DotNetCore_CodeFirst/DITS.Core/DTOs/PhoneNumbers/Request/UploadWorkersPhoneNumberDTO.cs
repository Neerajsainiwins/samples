using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.DTOs.PhoneNumbers.Request
{
    public class UploadWorkersPhoneNumberDTO
    {
        [Required(ErrorMessage = "OrganisationSiteId is required")]
        public Guid OrganisationSiteId { get; set; }
        public List<string>? WorkersPhoneNumber { get; set; } = null;
    }


    public class WorkerPhoneNumberModel
    {
        public string PhoneNumber { get; set; }
    }
}
