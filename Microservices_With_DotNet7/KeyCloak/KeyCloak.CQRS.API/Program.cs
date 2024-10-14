using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAutoMapper(typeof(MappingProfiles));

builder.Services.AddControllers().AddDapr();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseNpgsql(builder.Configuration.GetConnectionString(nameof(AppDbContext)));
});

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

builder.Services.AddSwaggerGen(option => {
    option.AddSecurityDefinition(builder.Configuration.GetValue<string>("Swagger:Scheme"), new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = builder.Configuration.GetValue<string>("Swagger:Type"),
        Type = SecuritySchemeType.Http,
        BearerFormat = builder.Configuration.GetValue<string>("Swagger:BearerFormat"),
        Scheme = builder.Configuration.GetValue<string>("Swagger:Scheme")
    });
});

builder.Services.AddHttpClient(HttpClientType.KeycloakClient.ToString()).AddHttpMessageHandler<LoggingHandler>();

builder.Services.AddHttpClient(HttpClientType.DefaultClient.ToString(), client =>
{
 client.BaseAddress = new Uri(builder.Configuration.GetValue<string>("ApiSettings:GatewayUrl"));
});

builder.Services.AddSingleton(provider =>
{
 var environment = provider.GetRequiredService<IHostEnvironment>().EnvironmentName;
 var httpClientFactory = provider.GetRequiredService<IHttpClientFactory>();
 return new CustomHttpClientFactory(environment, httpClientFactory);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

builder.Services.AddHttpClient();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.UseCors("AllowAll");

app.UseEndpoints(endpoints =>
{
 endpoints.MapSubscribeHandler();
 endpoints.MapControllers();
});

app.Run();