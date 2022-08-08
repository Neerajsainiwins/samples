using DITS.Core.Entities.Language;
using DITS.Core.Helpers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DITS.Core.Questions
{
    public class QuestionAudio
    {
        [Key]
        [Column("QuestionAudioId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid QuestionAudioId { get; set; } = Guid.NewGuid();
        [Display(Name = "Question")]
        public virtual Guid QuestionId { get; set; }
        [Display(Name = "Language")]
        public virtual Guid LanguageId { get; set; }
        public string AudioUrl { get; set; } = null!;
        public string Duration { get; set; } = null!;
        [Column(TypeName = "varchar(50)")]
        public string CreatedBy { get; set; } = null!;
        [Column(TypeName = "varchar(50)")]
        public string UpdatedBy { get; set; } = null!;
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public DateTime UpdatedOn { get; set; } = DateTime.Now;

        [ForeignKey("QuestionId")]
        public virtual Question Question { get; set; } = null!;
        [ForeignKey("LanguageId")]
        public virtual Languages Language { get; set; } = null!;
    }
}
