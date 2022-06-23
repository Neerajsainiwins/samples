﻿using Admin.Core.Entities.Base;
using Microsoft.AspNetCore.Identity;
using System;

namespace Admin.Core.Entities
{
    public class AspnetRunUser : IdentityUser<int>, IEntityBase<int>
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public DateTime LastLoginTime { get; set; }

        public bool IsWorking { get; set; }
    }
}
