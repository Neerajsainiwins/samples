//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DITS.Repository
{
    using System;
    using System.Collections.Generic;
    
    public partial class UserLoginDetail
    {
        public int UserId { get; set; }
        public int UserBasicInformationId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public Nullable<System.DateTime> LastLoggedIn { get; set; }
        public Nullable<System.DateTime> PasswordExpiration { get; set; }
        public Nullable<int> FailedAttempts { get; set; }
        public bool IsLocked { get; set; }
    }
}