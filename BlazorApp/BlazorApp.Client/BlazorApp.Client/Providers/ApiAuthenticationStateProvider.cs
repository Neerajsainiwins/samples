using Blazored.SessionStorage;
using System.Security.Claims;
using Microsoft.AspNetCore.Components.Authorization;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Components;

namespace BlazorApp.Client.Providers
{
    public class ApiAuthenticationStateProvider : AuthenticationStateProvider
    {
        private readonly ISessionStorageService sessionStorageService;
        private readonly JwtSecurityTokenHandler jwtSecurityTokenHandler;
        public ApiAuthenticationStateProvider(ISessionStorageService sessionStorageService)
        {
            this.sessionStorageService = sessionStorageService;
            jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
        }

        public override async Task<AuthenticationState> GetAuthenticationStateAsync()
        {
            var savedToken = await sessionStorageService.GetItemAsync<string>("accessToken");
            var user = new ClaimsPrincipal(new ClaimsIdentity());
            if (savedToken != null)
            {
                var tokenContent = jwtSecurityTokenHandler.ReadJwtToken(savedToken);

                if (tokenContent.ValidTo < DateTime.Now)
                {
                    await sessionStorageService.RemoveItemAsync("accessToken");
                }
                else
                {
                    var claims = tokenContent.Claims;
                    user = new ClaimsPrincipal(new ClaimsIdentity(claims, "jwt"));
                }
            }
            return new AuthenticationState(user);
        }

        public async Task LoggedIn(string token)
        {
            await sessionStorageService.SetItemAsync("accessToken", token);
            var tokenContent = jwtSecurityTokenHandler.ReadJwtToken(token);
            var claims = tokenContent.Claims;
            var user = new ClaimsPrincipal(new ClaimsIdentity(claims, "jwt"));
            var authState = Task.FromResult(new AuthenticationState(user));
            NotifyAuthenticationStateChanged(authState);
        }   

        public async Task LoggedOut()
        {
            await sessionStorageService.RemoveItemAsync("accessToken");
            var nobody = new ClaimsPrincipal(new ClaimsIdentity());
            var authState = Task.FromResult(new AuthenticationState(nobody));
            NotifyAuthenticationStateChanged(authState);
        }
    public Dictionary<string, string> DecodeJwtAndGetClaims(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                throw new ArgumentException("Token cannot be null or empty.", nameof(token));
            }

            var tokenContent = jwtSecurityTokenHandler.ReadJwtToken(token);
            return tokenContent.Claims.ToDictionary(claim => claim.Type, claim => claim.Value);
        }
    }
}