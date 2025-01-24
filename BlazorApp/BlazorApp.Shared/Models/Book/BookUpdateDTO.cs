using System.ComponentModel.DataAnnotations;
using BlazorApp.Server.Models;

namespace BlazorApp.Shared.Models.Book
{
    public class BookUpdateDTO
    {
        [Required]
        [StringLength(50)]
        public string Title { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Year { get; set; }
        [Required]
        public string ISBN { get; set; }
        public string Summary { get; set; }
        public string IMage { get; set; }
        [Required]
        [Range(0, int.MaxValue)]
        public decimal Price { get; set; }
    }
}
