using System.ComponentModel.DataAnnotations;

namespace BlazorApp.Server.Data
{
    public class UserToken
    {
        [Key]
        public int Id { get; set; }             
        public string? UserId { get; set; }          
        public string? Token { get; set; }      
        public string? TokenType { get; set; }    
        public DateTime Expiration { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsRevoked { get; set; } 
        public ApiUser? User { get; set; }          
    }
}
