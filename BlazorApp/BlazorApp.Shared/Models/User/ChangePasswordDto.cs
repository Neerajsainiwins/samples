using System.ComponentModel.DataAnnotations;

namespace BlazorApp.Shared.Models.User

{
    public class ChangePasswordDto
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string CurrentPassword { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string NewPassword { get; set; }

        [Required(ErrorMessage = "Please confirm your new password.")]
        [Compare("NewPassword", ErrorMessage = "The confirmation password does not match.")]
        public string ConfirmNewPassword { get; set; }
    }


}
