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
    
    public partial class UserEducationDetail
    {
        public int UserEducationDetailId { get; set; }
        public int UserBasicInformationId { get; set; }
        public int QualificationType { get; set; }
        public string InstituteName { get; set; }
        public int Course { get; set; }
        public string PassoutYear { get; set; }
        public Nullable<decimal> Percentage { get; set; }
        public bool CurrentlyStudying { get; set; }
    }
}
