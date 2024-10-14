using Project.KeyCloak.API.DTOs;

namespace Project.KeyCloak.API.Services
{ 
    public interface IAuthService
    {
       Task<KeycloakTokenResponseDto?> GetTokenResponseAsync(KeycloakUserDto keycloakUserDto);
       Task<KeycloakTokenResponseDto?> GetRefreshTokenResponseAsync(RefreshTokenDto refreshTokenDto);
    }
}