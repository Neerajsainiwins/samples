using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Infrastructure.IoC.Middlewares
{
    public static class InjectMiddlewares
    {
        public static void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            /* swagger */
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Authenticaton Microservices V1.1");
            });

            /* cores */
            app.UseCors("MyPolicy");

            /* identity server */
            app.UseIdentityServer();
        }
    }
}
