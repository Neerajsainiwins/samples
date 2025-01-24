using BlazorApp.Server.Models.User;
using BlazorApp.Client.Providers;
using BlazorApp.Client.Services.Authentication;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.JSInterop;
using System.Net.Http.Json;
using BlazorApp.Client.Components.Enums;

namespace BlazorApp.Client.Services.Service
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly HttpClient httpClient;
        private readonly Blazored.SessionStorage.ISessionStorageService sessionStorageService;
        private readonly AuthenticationStateProvider authenticationStateProvider;
        private NavigationManager _navigationManager;
        private ToastService toastService;

        public AuthenticationService(HttpClient httpClient, Blazored.SessionStorage.ISessionStorageService sessionStorageService, AuthenticationStateProvider authenticationStateProvider, NavigationManager navigationManager, ToastService toastService)
        {
            this.httpClient = httpClient;
            this.sessionStorageService = sessionStorageService;
            this.authenticationStateProvider = authenticationStateProvider;
            _navigationManager = navigationManager;
            this.toastService = toastService;
        }
        public async Task<bool> AuthenticateAsync(LoginUserDto user)
        {
            var response = await httpClient.PostAsJsonAsync("http://localhost:5093/api/Auth/login", user);
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<AuthResponse>();

                //Store Token
                await sessionStorageService.SetItemAsync("accessToken", result?.Token);

                //Change auth state of App
                await ((ApiAuthenticationStateProvider)authenticationStateProvider).LoggedIn(result.Token);
            }
            return response.IsSuccessStatusCode;
        }
        public async Task Logout()
        {
            await ((ApiAuthenticationStateProvider)authenticationStateProvider).LoggedOut();
            _navigationManager.NavigateTo("/");
            toastService.ShowToast("Logout successfully!", ToastLevel.Success);
        }
    }
}
