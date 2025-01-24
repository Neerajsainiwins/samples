using System.ComponentModel.DataAnnotations;
using BlazorApp.Server.Models;

namespace BlazorApp.Shared.Models.Author
{
    //public class AuthorReadOnlyDTO:BaseDTO
    //{

    //    public string FirstName { get; set; }

    //    public string LastName { get; set; }
    //    public string Bio { get; set; }
    //}
    public class AuthorReadOnlyDTO : BaseDTO
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string Bio { get; set; }
    }
}
