using System.ComponentModel.DataAnnotations;

namespace BCommerce.KeyCloak.API.Infrastructure.Entities
{
    public class Clients : CommonTable
    {
        [Required]
        public string ClientGuid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; } = string.Empty;
        public string RootUrl { get; set; } = string.Empty;
        public string AdminUrl { get; set; } = string.Empty;
        public string BaseUrl { get; set; } = string.Empty;
        public bool Enabled { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; } = string.Empty;
    }
}