using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DITS.Core.Entities.Language
{
    public class Languages
    {
        [Key]
        [Column("LanguageId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid LanguageId { get; set; } = Guid.NewGuid();
        public string LanguageLabel { get; set; } = null!;
        public string Iso { get; set; } = null!;
    }
}
