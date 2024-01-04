using BCommerce.KeyCloak.API.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace BCommerce.KeyCloak.API.Infrastructure.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Clients> Clients { get; set; }
        public DbSet<Roles> Roles { get; set; }
    }
}