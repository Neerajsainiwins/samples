using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Admin.Application.Models
{
    internal class AdminModel
    {
    }
    public class TenantDetailModel
    {
        public int Id { get; set; }
        public int CountryId { get; set; }
        public string CountryName { get; set; }
        public int CurrencyId { get; set; }
        public string Currency { get; set; }
        public int LanguageId { get; set; }
        public string LanguageName { get; set; }
        public int PasswordExpirationTime { get; set; }
        public string DomainName { get; set; }
        public int SmtpPort { get; set; }
        public string EmailAddress { get; set; }
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Password { get; set; }
        public string SmtpHost { get; set; }
        public int TenantId { get; set; }

    }
    public class TenantResponse
    {
        public TenantDetailModel Data { get; set; }
    }
}
