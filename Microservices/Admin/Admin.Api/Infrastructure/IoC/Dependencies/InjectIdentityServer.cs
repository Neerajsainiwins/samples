using Admin.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Admin.Api.Infrastructure.IoC.Dependencies
{
    public static class InjectIdentityServer
    {
        public static void ConfigureServices(IServiceCollection services, string connectionString)
        {
            /* configure database */
            services.AddDbContext<AdminDbContext>(config =>
            {
                config.UseSqlServer(connectionString);
            });
        }
    }
}
