using KeyCloak.API.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace KeyCloak.API.Infrastructure.Context
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
    }
}