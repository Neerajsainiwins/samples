using System.ComponentModel.DataAnnotations;

namespace BCommerce.KeyCloak.API.Infrastructure.Entities
{
    public abstract class CommonTable
    {
        [Key, Required]
        public int Id { get; set; }
        public bool Status { get; set; } = false;
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedOn { get; set; }
        public int ModifiedBy { get; set; }
    }
}