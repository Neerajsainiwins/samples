namespace BCommerce.KeyCloak.API.Infrastructure.Entities
{
    public class Users : CommonTable
    {
        public string UserId { get; set; }
        public string RoleId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool Enabled { get; set; }
    }
}