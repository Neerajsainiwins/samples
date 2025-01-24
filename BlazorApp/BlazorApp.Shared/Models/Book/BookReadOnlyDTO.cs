using BlazorApp.Server.Models;
using System.ComponentModel.DataAnnotations;
namespace BlazorApp.Shared.Models.Book
{
    public class BookReadOnlyDTO : BaseDTO
    {
        public int BookId { get; set; }
        public string? Title { get; set; }
        [Required]
        [Range(0, int.MaxValue)]
        public int Year { get; set; }
        public string ISBN { get; set; }
        public string Summary { get; set; }

        public string Image { get; set; }
        public decimal Price { get; set; }

        public int AuthorId { get; set; }
        public string AuthorName { get; set; }

    }
}
