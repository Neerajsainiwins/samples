using System.ComponentModel.DataAnnotations;

namespace AuthIdentityServer.Models.AccountViewModels
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
