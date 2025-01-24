using System.ComponentModel.DataAnnotations;

namespace BlazorApp.Shared.Models.Book
{
    public class BookDetailsDTO
    {
        public string Title { get; set; }
        public int Year { get; set; }
        public string ISBN { get; set; }
        public string Summary { get; set; }
        public string IMage { get; set; }
        public decimal Price { get; set; }
        public int AuthorId { get; set; }
        public string AuthorName { get; set; }
    }
}
