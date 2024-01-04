using BCommerce.HttpAggregator.Services;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHttpClient<ISupplierService, SupplierService>();
builder.Services.AddHttpClient<IAirlineService, AirlineService>();
builder.Services.AddHttpClient<ICountryService, CountryService>();
builder.Services.AddControllers();
//builder.Services.AddSingleton<ISupplierService,SupplierService>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//Serilog Implementation
Log.Logger = new LoggerConfiguration().ReadFrom.
Configuration(builder.Configuration)
.Enrich.FromLogContext()
.CreateLogger();
builder.Services.AddSerilog();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.UseSerilogRequestLogging();
app.Run();
