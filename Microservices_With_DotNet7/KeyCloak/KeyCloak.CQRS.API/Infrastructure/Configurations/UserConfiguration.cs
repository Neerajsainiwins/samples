using BCommerce.KeyCloak.API.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BCommerce.KeyCloak.API.Infrastructure.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<Users>
    {
        public void Configure(EntityTypeBuilder<Users> builder)
        {
            builder.ToTable(nameof(Users),"dbo");
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Email).IsRequired();
        }
    }
}