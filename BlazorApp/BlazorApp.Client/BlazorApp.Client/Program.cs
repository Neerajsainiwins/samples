using BlazorApp.Client;
using BlazorApp.Client.Configurations;
using BlazorApp.Client.Providers;
using BlazorApp.Client.Services.Authentication;
using BlazorApp.Client.Services.IService;
using BlazorApp.Client.Services.Service;
using BlazorApp.Client.Services.User;
using BlazorApp.Client.Shared;
using Blazored.SessionStorage;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.AspNetCore.SignalR.Client;


var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Register HttpClient
builder.Services.AddScoped(sp =>
{
    var client = new HttpClient { BaseAddress = new Uri("http://localhost:5093/") };
    client.DefaultRequestHeaders.Add("Accept", "application/json");
    return client;
});
//AutoMapper Config
builder.Services.AddAutoMapper(typeof(MapperClientConfig));

// Add Blazored SessionStorage for local storage management
builder.Services.AddBlazoredSessionStorage();

// Authentication and Authorization
builder.Services.AddScoped<ApiAuthenticationStateProvider>();
builder.Services.AddScoped<AuthenticationStateProvider>(p => p.GetRequiredService<ApiAuthenticationStateProvider>());
builder.Services.AddAuthorizationCore(options =>
{
    options.AddPolicy("AnonymousPolicy", policy =>
    {
        policy.RequireAssertion(context => true);
    });
}); builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

// Application-specific services
builder.Services.AddScoped<IAuthorService, AuthorService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<HttpService>();
builder.Services.AddScoped<GetClaimsFromToken>();

builder.Services.AddSingleton(sp =>
    new HubConnectionBuilder()
        .WithUrl("http://localhost:5093/")
        .Build()
);

// Toast Service
builder.Services.AddSingleton<ToastService>();

// Logging for better debugging and error handling
builder.Services.AddLogging();
await builder.Build().RunAsync();
