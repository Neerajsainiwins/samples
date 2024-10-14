using Ocelot.Cache.CacheManager;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Ocelot.Provider.Consul;
using Ocelot.Provider.Polly;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

builder.Configuration.AddJsonFile($"ocelot.json", optional: false, reloadOnChange: false);

builder.Services.AddOcelot(builder.Configuration).AddPolly().AddConsul()
	.AddCacheManager(x =>
	{
		x.WithDictionaryHandle();
	});

builder.Services.AddSwaggerForOcelot(builder.Configuration,
  (o) =>
  {
	  o.GenerateDocsForGatewayItSelf = true;
  });

builder.Services.AddLogging(loggingBuilder =>
{
	loggingBuilder.AddConsole();
});

var app = builder.Build();

app.UseSwaggerForOcelotUI(opt =>
{
	opt.PathToSwaggerGenerator = "/swagger/docs";
});

app.UseHttpsRedirection();

app.UseRouting();
app.UseAuthorization();

await app.UseOcelot();

app.Run();