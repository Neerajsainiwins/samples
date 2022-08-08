using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.DTOs.OrganisationUsers.Request
{
    public class InviteUserDTO
    {
        [Required(ErrorMessage = "FirstName is required")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "LastName is required")]
        public string LastName { get; set; }
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }

        public string? PhysicalAddress { get; set; }

        [Required(ErrorMessage = "OrganisationId is required")]
        public Guid OrganisationId { get; set; }
        public bool IsAdministrator { get; set; }
        public List<Guid>? OrganisationSiteIds { get; set; }
    }

    public class UpdateUserDTO : InviteUserDTO
    {
        public Guid UserId { get; set; }
    }
}
