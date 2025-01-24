using System.ComponentModel.DataAnnotations;

namespace BlazorApp.Shared.Models.Author
{
    public class AuthorAddUpdateDTO
    {
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; }
        [StringLength(50)]
        public string LastName { get; set; }
        [StringLength(50)]
        public string Bio { get; set; }
    }
}
