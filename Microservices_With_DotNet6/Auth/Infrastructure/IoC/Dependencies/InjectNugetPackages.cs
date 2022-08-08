using Authentication.Infrastructure.Filters;
using AuthIdentityServer;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Infrastructure.IoC.Dependencies
{
    public static class InjectNugetPackages
    {
        //public static void ConfigureServices(IServiceCollection services)
        //{
        //    /* swagger package */
        //    services.AddSwaggerGen(c =>
        //    {
        //        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Banking Microservice", Version = "v1" });
        //    });

        //    /* cors setting */
        //    services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
        //    {
        //        builder.AllowAnyOrigin()
        //               .AllowAnyMethod()
        //               .AllowAnyHeader();
        //    }));

        //    /* action filters to handle fluent validations */
        //    services.AddMvc(options =>
        //    {
        //        options.Filters.Add(new ValidatonFilter());
        //    }).AddFluentValidation(options =>
        //    {
        //        options.RegisterValidatorsFromAssemblyContaining<Startup>();
        //    });

        //    /* configure api versioning */
        //    services.AddApiVersioning(config =>
        //    {
        //        config.DefaultApiVersion = new ApiVersion(1, 0);
        //        config.AssumeDefaultVersionWhenUnspecified = true;
        //        config.ReportApiVersions = true;
        //    });
        //    services.AddHealthChecks().AddSqlServer("Server=DITSDEVPC1;Database=FloristDb;Trusted_Connection=True;MultipleActiveResultSets=true");
        //}

    }
}
