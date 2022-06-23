using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Authentication.Infrastructure.IoC.Dependencies;
using AuthIdentityServer.Services;
using AuthIdentityServer.Models;
using Microsoft.OpenApi.Models;
using DefaultAPIPackage.API.Models;
using Microsoft.EntityFrameworkCore;
using DefaultAPIPackage.Services.Interfaces;
using DefaultAPIPackage.Services.Repositories;
using Authentication.Services;
using DefaultAPIPackage.Controllers;
using DefaultAPIPackage.Services;
using IdentityModel;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.FileProviders;
using System.IO;

namespace AuthIdentityServer
{
    public class Startup
    {
        private IConfiguration Configuration { get; }

        public Startup(IConfiguration config)
        {
            Configuration = config;
        }
        public void ConfigureServices(IServiceCollection services)
        {
            string connectionString = Configuration.GetConnectionString("DefaultConnection");

            InjectIdentityServer.ConfigureServices(services, connectionString);

            services.AddControllers().AddNewtonsoftJson();
            services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));

            services.AddDbContext<DatabaseContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultAPIPackageConnection"));
            });

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = "Cookies";
                options.DefaultChallengeScheme = "oidc";
            })
                .AddCookie("Cookies")
                .AddOpenIdConnect("oidc", options =>
                {
                    options.SignInScheme = "Cookies";
                    options.Authority = "https://groneproject.azurewebsites.net";
                    //options.Authority = "https://localhost:9001";
                    options.ClientId = "react";
                    options.GetClaimsFromUserInfoEndpoint = true;
                    options.ClientSecret = "secret".ToSha256();
                    options.ResponseType = "id_token token";

                    options.SaveTokens = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateAudience = false,
                        NameClaimType = "name",
                        RoleClaimType = "role"
                    };
                });

            services.AddTransient<ILoginService<ApplicationUser>, EFLoginService>();
            services.AddScoped<ISuperAdminService, SuperAdminService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IModulePermission, ModulePermissionRepository>();
            services.AddControllersWithViews();
            services.AddRazorPages();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v2", new OpenApiInfo { Title = "Auth Service", Version = "v2" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                            Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot/images")),
                RequestPath = "/wwwroot/images"
            });
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }            
            app.UseCors("MyPolicy");
            app.UseRouting();
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("v2/swagger.json", "Auth Service");
            });
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseIdentityServer();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
            });
        }
    }
}
