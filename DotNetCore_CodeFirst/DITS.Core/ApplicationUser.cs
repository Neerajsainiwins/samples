using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core
{
    public class ApplicationUser : IdentityUser
    {
        public bool IsApproved { get; set; }
        public DateTime? LastLoggedInDateUtc { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime? CreatedOn { get; set; } = DateTime.Now;
        public string UpdatedBy { get; set; } = null!;
        public DateTime UpdatedOn { get; set; } = DateTime.Now;

        public override string NormalizedEmail
        {
            get
            {
                return Email.ToUpper().Normalize(); 
            }
        }
        public ICollection<ApplicationUserRole> UserRoles { get; set; }
    }
}
