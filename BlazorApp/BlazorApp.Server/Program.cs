using BlazorApp.Client.Providers;
using BlazorApp.Server.Configurations;
using BlazorApp.Server.Data;
using BlazorApp.Server.Hubs;
using BlazorApp.Server.Shared;
using BlazorApp.Shared.Models.User;
using Blazored.SessionStorage;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text;
public partial class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        builder.Services.AddLogging();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "JwtAuthApi",
                Version = "v1",
                Description = "Authentication and Authorization in Asp.Net Core 8.0 with JWT and Swagger"
            });
        });

        builder.Host.UseSerilog((ctx, lc) =>
            lc.WriteTo.Console().ReadFrom.Configuration(ctx.Configuration));
        builder.Services.Configure<EmailSettings>
        (options => builder.Configuration.GetSection("EmailSettings").Bind(options));
        // Add AutoMapper
        builder.Services.AddAutoMapper(typeof(MapperConfig));

        // Configure Database
        var connString = builder.Configuration.GetConnectionString("AppDbConnection");
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(connString, sqlOptions => sqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null)));

        // Configure Identity
        builder.Services.AddIdentity<ApiUser, IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();
        builder.Services.AddScoped<UserManager<ApiUser>>();
        builder.Services.AddScoped<RoleManager<IdentityRole>>();
        builder.Services.AddScoped<PagedResultService>();
        builder.Services.AddScoped<TokenCreation>();
        //builder.Services.AddHttpContextAccessor();
        builder.Services.AddTransient<IEmailService, EmailService>();
  
        //Toast
        //builder.Services.AddScoped<ToastService>();


        // Add CORS
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", build =>
                build.AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowAnyOrigin());
        });
        var jwtKey = builder.Configuration["JwtSettings:Key"];
        if (string.IsNullOrEmpty(jwtKey))
        {
            throw new InvalidOperationException("JWT key is not configured.");
        }
        // Configure JWT Authentication
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,
                ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                ValidAudience = builder.Configuration["JwtSettings:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
            };
        });

        //SignalR Hubs
        builder.Services.AddSignalR();

        // Authorize box    
        builder.Services.AddSwaggerGen(opt =>
        {

            opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "bearer"
            });

            opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
        });

        var app = builder.Build();

        // Configure Middleware
        if (true)
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI();
        }


        // Middleware to redirect from base URL to Swagger UI
        app.Use(async (context, next) =>
        {
            if (context.Request.Path == "/")
            {
                context.Response.Redirect("/swagger/index.html");
                return;
            }
            await next();
        });


        app.UseCors("AllowAll");
        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();
        app.MapHub<AuthorHub>("/authorHub");
        app.MapHub<BookHub>("/bookHub");
        app.Run();
    }
}
