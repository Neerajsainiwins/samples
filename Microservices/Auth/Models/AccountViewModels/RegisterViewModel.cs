using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace AuthIdentityServer.Models.AccountViewModels
{
    
    public class RegisterViewModel
    {
        public RegisterViewModel()
        {
            User = new ApplicationUser();
        }
        [Display(Name = "Email")]
        [Required(ErrorMessage = "Business Email is a mandatory field.")]        
        public string Email { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        [RegularExpression(@"^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,}$", ErrorMessage = "Password must contain a minimum of eight characters including a digit (0-9),1 uppercase and 1 special characters.")]
        [Required(ErrorMessage = "Password is a mandatory field.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirm password is a mandatory field.")]
        [Compare("Password", ErrorMessage = "Password do not match.")]
        public string ConfirmPassword { get; set; }

        public string ReturnUrl { get; set; }

        public ApplicationUser User { get; set; }
    }
}
