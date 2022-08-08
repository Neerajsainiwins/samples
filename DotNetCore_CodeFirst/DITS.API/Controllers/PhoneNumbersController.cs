using DITS.Core.DTOs.PhoneNumbers.Request;
using DITS.Core.DTOs.PhoneNumbers.Response;
using DITS.Services.PhoneNumbers.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DITS.API.Controllers
{
    /// <summary>
    /// This controller is used for workers phone number.
    /// </summary>
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PhoneNumbersController : BaseController
    {
        private readonly IPhoneNumbersService _phoneNumbersService;

        public PhoneNumbersController(IPhoneNumbersService phoneNumbersService, IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
            _phoneNumbersService = phoneNumbersService;
        }

        /// <summary>
        /// This method is used to download workers phone numbers of an organisation site.
        /// </summary>
        [HttpGet]
        [Route("DownloadWorkersPhoneNumber")]
        public IActionResult DownloadWorkersPhoneNumber([Required] Guid organisationSiteId)
        {
            var result = _phoneNumbersService.DownloadWorkersPhoneNumber(organisationSiteId);
            var builder = new StringBuilder();
            builder.AppendLine("PhoneNumber");
            foreach (var phoneNumber in result.Data)
            {
                builder.AppendLine($"{phoneNumber.PhoneNumber}");
            }
            return File(Encoding.UTF8.GetBytes(builder.ToString()), "text/csv", "Workersphonenumber.csv");
        }
    }
}
