using DITS.Application.CientReports;
using DITS.Application.CientReports.Interfaces;
using DITS.Application.DetailedResults;
using DITS.Application.DetailedResults.Interfaces;
using DITS.Application.DataCycles;
using DITS.Application.DataCycles.Interfaces;
using DITS.Application.Organisations;
using DITS.Application.Organisations.Interfaces;
using DITS.Application.Priorities;
using DITS.Application.Priorities.Interfaces;
using DITS.Application.ResponseRates;
using DITS.Application.ResponseRates.Interfaces;
using DITS.Application.GlobalCodes;
using DITS.Application.GlobalCodes.Interfaces;
using DITS.Application.Questions;
using DITS.Application.Questions.Interfaces;
using DITS.Application.Sites;
using DITS.Application.Sites.Interfaces;
using DITS.Application.SiteSummary;
using DITS.Application.SiteSummary.Interfaces;
using DITS.Application.SurveyTemplates;
using DITS.Application.SurveyTemplates.Interfaces;
using DITS.Application.Users;
using DITS.Application.Users.Interfaces;
using DITS.Common;
using DITS.Core;
using DITS.Core.DTOs;
using DITS.Core.Interfaces;
using DITS.Core.Interfaces.ClientReports;
using DITS.Core.Interfaces.DetailedResults;
using DITS.Core.Interfaces.DataCycles;
using DITS.Core.Interfaces.Organisations;
using DITS.Core.Interfaces.Priorities;
using DITS.Core.Interfaces.ResponseRates;
using DITS.Core.Interfaces.GlobalCodes;
using DITS.Core.Interfaces.Questions;
using DITS.Core.Interfaces.Sites;
using DITS.Core.Interfaces.SiteSummary;
using DITS.Core.Interfaces.SurveyTemplate;
using DITS.Core.Interfaces.Users;
using DITS.Infrastucture.Data;
using DITS.Infrastucture.Repositories;
using DITS.Infrastucture.Repositories.ClientReports;
using DITS.Infrastucture.Repositories.DetailedResults;
using DITS.Infrastucture.Repositories.DataCycles;
using DITS.Infrastucture.Repositories.Organisations;
using DITS.Infrastucture.Repositories.Priorities;
using DITS.Infrastucture.Repositories.ResponseRates;
using DITS.Infrastucture.Repositories.GlobalCodes;
using DITS.Infrastucture.Repositories.Questions;
using DITS.Infrastucture.Repositories.Sites;
using DITS.Infrastucture.Repositories.SiteSummary;
using DITS.Infrastucture.Repositories.Users;
using DITS.Infrastucture.Repositories.SurveyTemplate;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using DITS.Services.PhoneNumbers.Interfaces;
using DITS.Services.PhoneNumbers;
using DITS.Core.Interfaces.PhoneNumbers;
using DITS.Infrastucture.Repositories.PhoneNumbers;
using DITS.Services.OrganisationUsers.Interfaces;
using DITS.Services.OrganisationUsers;
using DITS.Core.Interfaces.OrganisationUsers;
using DITS.Infrastucture.Repositories.OrganisationUsers;
using DITS.Services.Reports.Interfaces;
using DITS.Core.Interfaces.Reports;
using DITS.Services.Reports;
using DITS.Infrastucture.Repositories.Reports;

var builder = WebApplication.CreateBuilder(args);

ConfigurationManager configuration = builder.Configuration;


// read connectionstring from appsetting

var connection = configuration.GetConnectionString("DatabaseConnection");
builder.Services.AddDbContext<Context>(options => options.UseSqlServer(connection));
builder.Services.Configure<ConnectionStrings>(configuration.GetSection("ConnectionStrings"));

// dependency injection of services and respositories

builder.Services.AddTransient<IOrganisationUserService, OrganisationUserServices>();
builder.Services.AddTransient<IOrganisationUserRepository, OrganisationUserRepository>();

builder.Services.AddTransient<ISitesService, SiteServices>();
builder.Services.AddTransient<ISitesRepository, SitesRepository>();

builder.Services.AddTransient<IPhoneNumbersService, PhoneNumbersService>();
builder.Services.AddTransient<IPhoneNumbersRepository, PhoneNumbersRepository>();

builder.Services.AddTransient<IReportsService, ReportsServices>();
builder.Services.AddTransient<IReportsRepository, ReportsRepository>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();

builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options => options.Stores.MaxLengthForKeys = 128)
            .AddEntityFrameworkStores<Context>()
            .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})

// Adding Jwt Bearer
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero,

        ValidAudience = configuration["JWT:ValidAudience"],
        ValidIssuer = configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))
    };
});

// role based authentication
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Administrator", options => options.RequireRole("Administrator"));
});

builder.Services.AddOptions();
builder.Services.Configure<Config>(configuration.GetSection("Configurations"));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "DITS API", Version = "v1" });
});

// allow cors policies
builder.Services.AddCors(o =>
{
    o.AddPolicy(name: "corsPolicy",
                  builder =>
                  {
                      builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .WithExposedHeaders("*");
                  });
});

var app = builder.Build();


// Configure the HTTP request pipeline.

app.UseCors("corsPolicy");

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "DITS API v1"));
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();