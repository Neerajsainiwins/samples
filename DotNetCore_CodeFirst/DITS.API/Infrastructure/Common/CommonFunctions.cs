using DITS.Core.DTOs;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace DITS.API.Infrastructure.Common
{
    public class CommonFunctions
    {
        public string GenrateOTP()
        {
            Random rnd = new Random();
            string randomNumber = (rnd.Next(100000, 999999)).ToString();
            return randomNumber;
        }
        public string SendVerificationCode(string emailAddress)
        {
            var client = new SendGridClient("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");
            var OTP = GenrateOTP();
            SendGridMessage msg = new SendGridMessage()
            {
                From = new EmailAddress("neerajsainiwins@gmail.com", "Neeraj Saini"),
                Subject = "Send Verification Code",
                TemplateId = "d-3dd6c9192ce7498b9f69e0677da3729b"
            };
            msg.AddTo(new EmailAddress(emailAddress));
            msg.SetTemplateData(new
            {
                OTP = OTP,
            });
            try
            {
                var response = client.SendEmailAsync(msg).GetAwaiter().GetResult();
                if (response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.Accepted)
                {
                    return OTP;
                }
                else
                {
                    return "";
                }
            }
            catch (Exception)
            {
                return "";
            }
        }
    }
}
