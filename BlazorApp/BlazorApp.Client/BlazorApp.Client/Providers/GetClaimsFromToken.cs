using Blazored.SessionStorage;

namespace BlazorApp.Client.Providers
{
    public class GetClaimsFromToken
    {
        private readonly ISessionStorageService _sessionStorageService;
        private readonly ApiAuthenticationStateProvider _apiAuthenticationStateProvider;

        public GetClaimsFromToken( ISessionStorageService sessionStorageService, ApiAuthenticationStateProvider apiAuthenticationStateProvider)
        {
            _sessionStorageService = sessionStorageService;
            _apiAuthenticationStateProvider = apiAuthenticationStateProvider;
        }
        public async Task<Dictionary<string, string>> GetClaims(string claimName, string? tokendata = null)
        {
            var claims = new Dictionary<string, string>();

            try
            {
                var token = tokendata;   
                if(tokendata is null)
                {
                    token = await _sessionStorageService.GetItemAsync<string>("accessToken");
                }

                if (!string.IsNullOrEmpty(token))
                {
                    var decodedClaims = _apiAuthenticationStateProvider?.DecodeJwtAndGetClaims(token);

                    if (decodedClaims != null)
                    {
                        if (decodedClaims.TryGetValue(claimName, out string claimValue))
                        {
                            Console.WriteLine($"Claim value for {claimName}: {claimValue}");
                            claims.Add(claimName, claimValue);
                        }
                        else
                        {
                            throw new Exception($"Claim '{claimName}' not found in the token.");
                        }
                    }
                    else
                    {
                        throw new Exception("Failed to decode the token.");
                    }
                }
                else
                {
                    throw new Exception("No access token found in session storage.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving claims: {ex.Message}   Stack Trace: {ex.StackTrace}");
            }
            return claims;
        }
    }
}
