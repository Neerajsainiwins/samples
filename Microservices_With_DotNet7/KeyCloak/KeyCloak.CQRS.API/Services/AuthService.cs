using Project.KeyCloak.API.DTOs;
using Newtonsoft.Json;

namespace Project.KeyCloak.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly string BaseUrl;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        public AuthService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            BaseUrl = _configuration.GetValue<string>("KeyCloak:BaseUrl");
        }

        public async Task<KeycloakTokenResponseDto?> GetRefreshTokenResponseAsync(RefreshTokenDto refreshTokenDto)
        {
            using (var httpClient = _httpClientFactory.CreateClient())
            {
                var parameters = new FormUrlEncodedContent(new[]
                {
                  new KeyValuePair<string, string>("grant_type", "refresh_token"),
                 new KeyValuePair<string, string>("client_id", _configuration.GetValue<string>("ClientSecret:ClientId")),
                 new KeyValuePair<string, string>("client_secret", _configuration.GetValue<string>("ClientSecret:ClientSecret")),
                 new KeyValuePair<string, string>("refresh_token", refreshTokenDto.RefreshToken)
                 });

                var response = await httpClient
                    .PostAsync($"{BaseUrl}/realms/Realm-B/protocol/openid-connect/token", parameters)
                    .ConfigureAwait(false);

                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                    var keycloakTokenResponseDto = JsonConvert.DeserializeObject<KeycloakTokenResponseDto>(
                                      responseJson);

                    return keycloakTokenResponseDto;
                }
                else
                {
                    throw new KeycloakExceptionDto("Invalid credentials for Keycloak authentication.");
                }
            }
        }

        public async Task<KeycloakTokenResponseDto?> GetTokenResponseAsync(KeycloakUserDto keycloakUserDto)
        {
            using (var httpClient = _httpClientFactory.CreateClient())
            {
                var parameters = new FormUrlEncodedContent(new[]
                {
                  new KeyValuePair<string, string>("grant_type", _configuration.GetValue<string>("ClientSecret:GrantType")),
                 new KeyValuePair<string, string>("client_id", _configuration.GetValue<string>("ClientSecret:ClientId")),
                 new KeyValuePair<string, string>("client_secret", _configuration.GetValue<string>("ClientSecret:ClientSecret")),
                 new KeyValuePair<string, string>("username", keycloakUserDto.Username),
                 new KeyValuePair<string, string>("password", keycloakUserDto.Password)
                 });

                var response = await httpClient
                    .PostAsync($"{BaseUrl}/realms/Realm-B/protocol/openid-connect/token", parameters)
                    .ConfigureAwait(false);

                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                    var keycloakTokenResponseDto = JsonConvert.DeserializeObject<KeycloakTokenResponseDto>(
                                      responseJson);

                    return keycloakTokenResponseDto;
                }
                else
                {
                    throw new KeycloakExceptionDto("Invalid credentials for Keycloak authentication.");
                }
            }
        }
    }
}