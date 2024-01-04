using BCommerce.KeyCloak.API.DTOs;

namespace BCommerce.KeyCloak.API.Services
{ 
    public interface IAuthService
    {
       Task<KeycloakTokenResponseDto?> GetTokenResponseAsync(KeycloakUserDto keycloakUserDto);
       Task<KeycloakTokenResponseDto?> GetRefreshTokenResponseAsync(RefreshTokenDto refreshTokenDto);
    }
}