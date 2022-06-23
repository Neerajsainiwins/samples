using AuthIdentityServer;
using AuthIdentityServer.data;
using AuthIdentityServer.Models;
using AuthIdentityServer.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace Authentication.Infrastructure.IoC.Dependencies
{
    public static class InjectIdentityServer
    {
        public static void ConfigureServices(IServiceCollection services, string connectionString)
        {
            /* configure database */
            services.AddDbContext<AppDbContext>(config =>
            {
                config.UseSqlServer(connectionString);
            });

            /* configure identity configurations,password rules */
            services.AddIdentity<ApplicationUser, IdentityRole>(config =>
            {
                config.Password.RequiredLength = 4;
                config.Password.RequireDigit = false;
                config.Password.RequireNonAlphanumeric = false;
                config.Password.RequireUppercase = false;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

            /* cookie policies */
            services.ConfigureApplicationCookie(config =>
            {
                config.Cookie.Name = "IdentityServer.Cookie";
                config.LoginPath = "/Auth/Login";
                config.LogoutPath = "/Auth/Logout";
               
            });
            var assembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;

            services.AddIdentityServer().AddAspNetIdentity<ApplicationUser>()
                .AddProfileService<ProfileService>()
           .AddConfigurationStore(options =>
           {
               options.ConfigureDbContext = b => b.UseSqlServer(connectionString, sql => sql.MigrationsAssembly(assembly));
           }).AddOperationalStore(options =>
           {
               options.ConfigureDbContext = b => b.UseSqlServer(connectionString, sql => sql.MigrationsAssembly(assembly));
           })
           .AddDeveloperSigningCredential();
        }
    }
}
