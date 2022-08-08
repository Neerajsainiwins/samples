using DITS.Application.Users.Interfaces;
using DITS.Core;
using DITS.Core.DTOs.Common.Ṛesponse;
using DITS.Core.DTOs.Common.Response;
using DITS.Core.DTOs.Users.Request;
using DITS.Core.DTOs.Users.Ṛesponse;
using DITS.Infrastucture.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace DITS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly Context _dbcontext;
        private readonly ITokenBuilderServices _tokenBuilder;
        private readonly IAuthServices _authServices;

        public AuthController(Context dbcontext,
                              UserManager<ApplicationUser> userManager,
                              ITokenBuilderServices tokenBuilder,
                              IAuthServices authServices)
        {
            _dbcontext = dbcontext;
            _userManager = userManager;
            _tokenBuilder = tokenBuilder;
            _authServices = authServices;
        }

        /// <summary>
        /// This method is used to fetch user details after login
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel user)
        {
            try
            {
                LoginResponse result = new LoginResponse();
                LoginCommonResponse response = new LoginCommonResponse();
                AddRefreshTokenDTO addRefreshTokenDTO = new AddRefreshTokenDTO();

                // user details by user emailId
                var users = await _userManager.FindByNameAsync(user.Email);
                if (users != null && users.IsApproved)
                {
                    if (users != null && await _userManager.CheckPasswordAsync(users, user.Password))
                    {
                        var userRoles = await _userManager.GetRolesAsync(users);
                        var authClaims = new List<Claim>
                    {
                    // adding user details into claims
                    new Claim(JwtRegisteredClaimNames.Name, users.UserName),
                    new Claim("UserId", users.Id),
                    new Claim("Email", users.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    };

                        foreach (var userRole in userRoles)
                        {
                            authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                        }

                        // generating access token
                        var token = _tokenBuilder.GenerateAccessToken(authClaims);

                        // generating refresh token
                        var refreshToken = _tokenBuilder.GenerateRefreshToken(users.UserName);

                        addRefreshTokenDTO.UserId = users.Id;
                        addRefreshTokenDTO.RefreshToken = refreshToken;

                        // saving refresh token into database
                        var refreshTokenResponse = _tokenBuilder.SaveRefreshToken(addRefreshTokenDTO);
                        if (refreshTokenResponse == 0) return BadRequest(response);

                        result.UserId = users.Id;
                        result.UserName = users.UserName;
                        result.Email = users.Email;
                        result.AccessToken = token;
                        result.RefreshToken = refreshToken;
                        response.Data = result;
                        response.Message = "Logged in successfully!";
                        return Ok(response);
                    }
                    response.Data = null;
                    response.Message = "Username and password are incorrect";
                    return BadRequest(response);
                }
                else
                {
                    response.Data = null;
                    response.Message = "You're not authorize to access this application.";
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        /// <summary>
        /// This method is used to verify the user. 
        /// </summary>
        [HttpGet("verify")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> VerifyToken()
        {
            var username = User.Claims.ToList().Find(x => x.Type == "Email");

            if (username == null)
            {
                return Unauthorized();
            }

            var userExists = await _dbcontext.Users.AnyAsync(u => u.Email == username.Value);

            if (!userExists)
            {
                return Unauthorized();
            }

            return NoContent();
        }

       
        .0
        public async Task<IActionResult> Revoke(string username, string refreshToken)
        {
            CommonResponse response = new CommonResponse();
            ResponseModel responseModel = new ResponseModel();
            var user = await _userManager.FindByNameAsync(username);
            var refreshTokens = _dbcontext.RefreshTokens.AsNoTracking().Where(x => x.RefreshTokenId == refreshToken && x.UserId == user.Id).FirstOrDefault();

            if (refreshTokens == null)
            {
                response.Message = "Invalid user name";
                return BadRequest(response);
            }
            refreshTokens.RefreshTokenId = null;
            _dbcontext.RefreshTokens.Attach(refreshTokens);
            _dbcontext.Entry(refreshTokens).State = EntityState.Modified;
            _dbcontext.SaveChanges();
            responseModel.Id = new Guid(user.Id);
            response.Data = responseModel;
            response.Message = "Logged out successfully.";
            return Ok(response);
        }

        [Authorize]
        [HttpPost]
        [Route("revoke-all")]
        public async Task<IActionResult> RevokeAll()
        {
            var users = _userManager.Users.ToList();
            foreach (var user in users)
            {
                await _userManager.UpdateAsync(user);
            }
            return NoContent();
        }
    }
}
