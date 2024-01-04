using BCommerce.KeyCloak.API.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BCommerce.KeyCloak.API.Infrastructure.Configurations
{
    public class RoleConfiguration : IEntityTypeConfiguration<Roles>
    {
        public void Configure(EntityTypeBuilder<Roles> builder)
        {
            builder.ToTable(nameof(Roles),"dbo");
            builder.HasKey(p => p.Id);

            builder.Property(p => p.RoleName).IsRequired();
        }
    }
}