using BlazorApp.Server.Models.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BlazorApp.Server.Data;

public partial class AppDbContext : IdentityDbContext<ApiUser>
{

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
        Authors = Set<Author>();
        Books = Set<Book>();
        UserTokens = Set<UserToken>();
    }

    public virtual DbSet<Author> Authors { get; set; }
    public virtual DbSet<Book> Books { get; set; }
    public new DbSet<UserToken> UserTokens { get; set; } 
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Author>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Authors__3214EC07850D70B5");

            entity.Property(e => e.Bio).HasMaxLength(50).IsFixedLength();
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
        });

        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.BookId).HasName("PK__Books__3DE0C207C154E70B");

            entity.HasIndex(e => e.Isbn, "UQ__Books__447D36EADFD09C0E").IsUnique();

            entity.Property(e => e.Isbn)
                .HasMaxLength(50)
                .HasColumnName("ISBN");
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Summary).HasMaxLength(250);
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.Author).WithMany(p => p.Books)
                .HasForeignKey(d => d.AuthorId)
                .HasConstraintName("FK__Books__AuthodId__60A75C0F");
        });

        modelBuilder.Entity<UserToken>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(u => u.User)
                 .WithMany()
                 .HasForeignKey(u => u.UserId)
                 .OnDelete(DeleteBehavior.Cascade);

            // Optional: Configure other properties
            entity.Property(e => e.Token).IsRequired();
            entity.Property(e => e.TokenType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Expiration).IsRequired();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
        });

        modelBuilder.Entity<IdentityRole>().HasData(
            new IdentityRole
            {
                Name = "User",
                NormalizedName = "USER",
                Id = "69A8F7F5-936E-439F-9F00-6E820488619C"
            },
            new IdentityRole
            {
                Name = "Adminstrator",
                NormalizedName = "ADMINSTRATOR",
                Id = "6DDE355C-D592-44AF-98F8-761E0960012A"
            }
            );
        var hasher = new PasswordHasher<ApiUser>();
        modelBuilder.Entity<ApiUser>().HasData(
         new ApiUser
         {
             Id = "865B40FD-567E-4DBD-9182-9E17CCC1CE6B",
             Email = "admin@bookstore.com",
             NormalizedEmail = "ADMIN@BOOKSTORE.COM",
             UserName = "admin@bookstore.com",
             NormalizedUserName = "ADMIN@BOOKSTORE.COM",
             FirstName = "System",
             LastName = "Admin",
             PasswordHash = hasher.HashPassword(null, "P@ssword1")
         },
         new ApiUser
         {
             Id = "7542B730-CB46-4A93-B714-ECD68ECCF4ED",
             Email = "user@bookstore.com",
             NormalizedEmail = "USER@BOOKSTORE.COM",
             UserName = "user@bookstore.com",
             NormalizedUserName = "USER@BOOKSTORE.COM",
             FirstName = "System",
             LastName = "User",
             PasswordHash = hasher.HashPassword(null, "P@ssword1")
         }
         );
        modelBuilder.Entity<IdentityUserRole<string>>().HasData(
        new IdentityUserRole<string>
        {
            RoleId = "69A8F7F5-936E-439F-9F00-6E820488619C",
            UserId = "7542B730-CB46-4A93-B714-ECD68ECCF4ED"

        },
        new IdentityUserRole<string>
        {
            RoleId = "6DDE355C-D592-44AF-98F8-761E0960012A",
            UserId = "865B40FD - 567E-4DBD - 9182 - 9E17CCC1CE6B",

        });
        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
