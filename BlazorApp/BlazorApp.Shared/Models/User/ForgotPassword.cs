
using System.ComponentModel.DataAnnotations;

namespace BlazorApp.Shared.Models.User
{
    public class ForgotPassword
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
