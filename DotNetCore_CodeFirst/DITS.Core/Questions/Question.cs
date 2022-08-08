using DITS.Core.Helpers;
using DITS.Core.Indicators;
using DITS.Core.Organisations;
using DITS.Core.SurveyResponse;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DITS.Core.Questions
{
    public class Question
    {
        [Key]
        [Column("QuestionId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid QuestionId { get; set; } = Guid.NewGuid();
        [Display(Name = "Indicator")]
        public virtual Guid? IndicatorId { get; set; }
        public string InternalId { get; set; } = null!;
        //[Column(TypeName = "varchar(1000)")]
        //public string Label { get; set; }
        [Column(TypeName = "nvarchar(2000)")]
        public string QuestionText { get; set; }
        public bool IsYesApositiveResponse { get; set; }
        [Display(Name = "GlobalCode1")]
        public virtual Guid? Dtmf1Code { get; set; }
        [Display(Name = "GlobalCode2")]
        public virtual Guid? Dtmf2Code { get; set; }
        [Display(Name = "GlobalCode3")]
        public virtual Guid? Dtmf3Code { get; set; }
        [Display(Name = "GlobalCode4")]
        public virtual Guid? Dtmf4Code { get; set; }
        [Display(Name = "GlobalCode5")]
        public virtual Guid? Dtmf5Code { get; set; }
        [Display(Name = "GlobalCode6")]
        public virtual Guid? Dtmf6Code { get; set; }
        [Display(Name = "GlobalCode7")]
        public virtual Guid? Dtmf7Code { get; set; }
        [Display(Name = "GlobalCode8")]
        public virtual Guid? Dtmf8Code { get; set; }
        [Display(Name = "GlobalCode9")]
        public virtual Guid? Dtmf9Code { get; set; }
        public bool IsConsentQuestion { get; set; }
        public bool IsAnticoachingQuestion { get; set; }
        public bool IsSurveySetupElementQuestion { get; set; }
        public bool IsCoreQuestion { get; set; }
        public bool IsSegmentationQuestion { get; set; }
        public bool IsResponseRequired { get; set; }
        [Column(TypeName = "varchar(50)")]
        public string CreatedBy { get; set; } = null!;
        [Column(TypeName = "varchar(50)")]
        public string UpdatedBy { get; set; } = null!;
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public DateTime UpdatedOn { get; set; } = DateTime.Now;
        public bool IsArchived { get; set; } = false;
        [ForeignKey("IndicatorId")]
        public virtual Indicator? Indicator { get; set; }
        [ForeignKey("Dtmf1Code")]
        public virtual GlobalCode? GlobalCode1 { get; set; }
        [ForeignKey("Dtmf2Code")]
        public virtual GlobalCode? GlobalCode2 { get; set; }
        [ForeignKey("Dtmf3Code")]
        public virtual GlobalCode? GlobalCode3 { get; set; }
        [ForeignKey("Dtmf4Code")]
        public virtual GlobalCode? GlobalCode4 { get; set; }
        [ForeignKey("Dtmf5Code")]
        public virtual GlobalCode? GlobalCode5 { get; set; }
        [ForeignKey("Dtmf6Code")]
        public virtual GlobalCode? GlobalCode6 { get; set; }
        [ForeignKey("Dtmf7Code")]
        public virtual GlobalCode? GlobalCode7 { get; set; }
        [ForeignKey("Dtmf8Code")]
        public virtual GlobalCode? GlobalCode8 { get; set; }
        [ForeignKey("Dtmf9Code")]
        public virtual GlobalCode? GlobalCode9 { get; set; }
    }
}
