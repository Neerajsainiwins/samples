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
    
    public partial class UserContactDetail
    {
        public int UserContactId { get; set; }
        public int UserBasicInformationId { get; set; }
        public string Email { get; set; }
        public string AlternateEmail { get; set; }
        public string SkypeId { get; set; }
        public string PermanentAddress { get; set; }
        public int PermanentCity { get; set; }
        public int PermanentState { get; set; }
        public string PermanentZIP { get; set; }
        public int PermanentCountry { get; set; }
        public string CorrespondenceAddress { get; set; }
        public Nullable<int> CorrespondenceCity { get; set; }
        public Nullable<int> CorrespondenceState { get; set; }
        public string CorrespondenceZIP { get; set; }
        public Nullable<int> CorrespondenceCountry { get; set; }
        public string PhoneNumber { get; set; }
        public string AlternatePhoneNumber { get; set; }
    }
}
