using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace AuthIdentityServer.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        [Required(ErrorMessage = "First name is a mandatory field.")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "Last name is a mandatory field.")]
        public string LastName { get; set; }
    }
}
