using BlazorApp.Server.Models.User;

namespace BlazorApp.Client.Services.Authentication
{
    public interface IAuthenticationService
    {
        Task<bool> AuthenticateAsync(LoginUserDto loginUserDto);
         Task Logout();
    }
}
