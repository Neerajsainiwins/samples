using System.ComponentModel.DataAnnotations;

namespace BlazorApp.Shared.Models.User

{
    public class ResetPasswordDto
    {
        [Required]
        public string? Email { get; set; }

        public string? UserId { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string? NewPassword { get; set; }

        [DataType(DataType.Password)]
        public string? ConfirmPassword { get; set; }
    }

}
