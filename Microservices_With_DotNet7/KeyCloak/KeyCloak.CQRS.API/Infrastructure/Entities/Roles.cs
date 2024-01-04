using System.ComponentModel.DataAnnotations;

namespace BCommerce.KeyCloak.API.Infrastructure.Entities
{
    public class Roles : CommonTable
    {
        [Required]
        public string RoleId { get; set; }

        [Required(ErrorMessage ="RoleName is required")]
        public string RoleName { get; set; }
        public string RoleDescription { get; set; } = string.Empty;
    }
}