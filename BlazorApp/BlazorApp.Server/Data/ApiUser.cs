﻿using Microsoft.AspNetCore.Identity;

namespace BlazorApp.Server.Data
{
    public class ApiUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }
}
