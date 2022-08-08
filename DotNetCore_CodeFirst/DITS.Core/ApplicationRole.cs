using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core
{
    public class ApplicationRole : IdentityRole
    {
        public ICollection<ApplicationUserRole> UserRoles { get; set; }

        public override string NormalizedName
        {
            get => Name.ToUpper().Normalize();
            set => base.NormalizedName = value;
        }
    }
}
