using AutoMapper;
using Shared.Helpers;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace KeyCloak.API.Services
{
    public class UserService : IUserService
    {
        private readonly string BaseUrl;
        private readonly string RealmName;
        private readonly IMapper _mapper;
        private readonly HttpHelper _httpHelper;
        private readonly IConfiguration _configuration;
        private readonly ITokenResponseHandler _tokenResponse;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserService(IHttpClientFactory httpClientFactory, IMapper mapper,
            IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ITokenResponseHandler tokenResponse, HttpHelper httpHelper)
        {
            _mapper = mapper;
            _httpHelper = httpHelper;
            _tokenResponse = tokenResponse;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _httpContextAccessor = httpContextAccessor;
            BaseUrl = _configuration.GetValue<string>("KeyCloak:BaseUrl");
            RealmName = _configuration.GetValue<string>("KeyCloak:RealmName");
        }

        public async Task<ApiOkResponse> GetAllUsers()
        {
            try
            {
                using (var httpClient = _httpClientFactory.CreateClient(HttpClientType.KeycloakClient.ToString()))
                {
                    var accessToken = string.IsNullOrEmpty(_httpContextAccessor.HttpContext.Request.Headers[RequestHeaders.Authorization].ToString())
                        ? null : _httpContextAccessor.HttpContext.Request.Headers[RequestHeaders.Authorization].ToString().Split(" ")[1];
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(RequestHeaders.Bearer, accessToken);

                    var response = await httpClient
                        .GetAsync($"{BaseUrl}{UrlPaths.AdminRealms}{RealmName}/users")
                        .ConfigureAwait(false);

                    if (response.IsSuccessStatusCode)
                    {
                        var responseContent = await response.Content.ReadAsStringAsync();
                        var users = JsonConvert.DeserializeObject<List<KeycloakUserDetailDto>>(responseContent);
                        return new ApiOkResponse(users);
                    }
                    else
                    {
                        var errorResponse = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                        return new ApiOkResponse(errorResponse);
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ApiOkResponse> GetUsersById(string userId)
        {
            try
            {
                using (var httpClient = _httpClientFactory.CreateClient(HttpClientType.KeycloakClient.ToString()))
                {
                    var accessToken = string.IsNullOrEmpty(_httpContextAccessor.HttpContext.Request.Headers[RequestHeaders.Authorization].ToString())
                        ? null : _httpContextAccessor.HttpContext.Request.Headers[RequestHeaders.Authorization].ToString().Split(" ")[1];
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(RequestHeaders.Bearer, accessToken);

                    var response = await httpClient
                        .GetAsync($"{BaseUrl}{UrlPaths.AdminRealms}{RealmName}/users/{userId}")
                        .ConfigureAwait(false);

                    if (response.IsSuccessStatusCode)
                    {
                        var responseContent = await response.Content.ReadAsStringAsync();
                        var user = JsonConvert.DeserializeObject<KeycloakUserDetailDto>(responseContent);
                        return new ApiOkResponse(user);
                    }
                    else
                    {
                        var errorResponse = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                        return new ApiOkResponse(errorResponse);
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }


    }
}