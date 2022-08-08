using System.ComponentModel.DataAnnotations;

namespace AuthIdentityServer.Models.AccountViewModels
{
    public class LoginViewModel
    {
        [Required(AllowEmptyStrings = false)]
        public string Email { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
        public string ReturnUrl { get; set; }

        public string ImageUrl { get; set; }

    }
}