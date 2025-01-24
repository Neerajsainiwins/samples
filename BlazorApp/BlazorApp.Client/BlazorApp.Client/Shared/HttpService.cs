using Microsoft.AspNetCore.Components;
using System.Net.Http.Headers;
using System.Net;
using System.Text.Json;
using System.Text;
using Blazored.SessionStorage;
using System.Net.Http.Json;

namespace BlazorApp.Client.Shared
{
    public interface IHttpService
    {
        Task<T> Get<T>(string uri);
        Task Post(string uri, object value);
        Task<T> Post<T>(string uri, object value);
        Task Put(string uri, object value);
        Task<T> Put<T>(string uri, object value);
        Task Delete(string uri);
        Task<T> Delete<T>(string uri);
    }

    public class HttpService : IHttpService
    {
        private readonly HttpClient _httpClient;
        private readonly NavigationManager _navigationManager;
        private readonly ISessionStorageService _sessionStorageService;

        public HttpService(HttpClient httpClient, NavigationManager navigationManager, ISessionStorageService sessionStorageService)
        {
            _httpClient = httpClient;
            _navigationManager = navigationManager;
            _sessionStorageService = sessionStorageService;
        }
        public async Task Get(string uri) => await SendRequest(HttpMethod.Get, uri);
        public async Task<T> Get<T>(string uri) => await SendRequest<T>(HttpMethod.Get, uri);
        public async Task Post(string uri, object value) => await SendRequest(HttpMethod.Post, uri, value);
        public async Task<T> Post<T>(string uri, object value) => await SendRequest<T>(HttpMethod.Post, uri, value);
        public async Task Put(string uri, object value) => await SendRequest(HttpMethod.Put, uri, value);
        public async Task<T> Put<T>(string uri, object value) => await SendRequest<T>(HttpMethod.Put, uri, value);
        public async Task Delete(string uri) => await SendRequest(HttpMethod.Delete, uri);
        public async Task<T> Delete<T>(string uri) => await SendRequest<T>(HttpMethod.Delete, uri);

        // Core request handler
        private async Task SendRequest(HttpMethod method, string uri, object value = null)
        {
            var request = CreateRequest(method, uri, value);
            await ProcessRequest(request);
        }

        private async Task<T> SendRequest<T>(HttpMethod method, string uri, object value = null)
        {
            var request = CreateRequest(method, uri, value);
            var response = await ProcessRequest(request);
            return await ParseResponse<T>(response);
        }

        private HttpRequestMessage CreateRequest(HttpMethod method, string uri, object value = null)
        {
            var request = new HttpRequestMessage(method, uri);
            if (value != null)
            {
                request.Content = new StringContent(JsonSerializer.Serialize(value), Encoding.UTF8, "application/json");
            }
            return request;
        }

        private async Task<HttpResponseMessage> ProcessRequest(HttpRequestMessage request)
        {
            await AddJwtHeader(request);

            var response = await _httpClient.SendAsync(request);

            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                _navigationManager.NavigateTo("user/logout");
                return null;
            }

            if (!response.IsSuccessStatusCode)
            {
                await HandleErrors(response);
            }
            return response;
        }

        private async Task<T> ParseResponse<T>(HttpResponseMessage response)
        {
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

        private async Task AddJwtHeader(HttpRequestMessage request)
        {
            var token = await _sessionStorageService.GetItemAsync<string>("accessToken");

            if (string.IsNullOrEmpty(token))
            {
                throw new InvalidOperationException("JWT token is missing or expired.");
            }
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        private async Task HandleErrors(HttpResponseMessage response)
        {
            string errorMessage;

            try
            {
                var error = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
                errorMessage = error?.ContainsKey("message") == true
                    ? error["message"]
                    : "An unexpected error occurred.";
            }
            catch
            {
                errorMessage = "An error occurred while processing the response.";
            }

            throw new HttpRequestException(errorMessage);
        }
    }
}
