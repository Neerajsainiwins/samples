using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using BlazorApp.Server.Data;
using BlazorApp.Server.Models.User;
using Microsoft.EntityFrameworkCore;
using BlazorApp.Server.Shared;
using BlazorApp.Shared.Models.User;
namespace BlazorApp.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private const string RefreshToken = "RefreshToken";
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger; 
    private readonly AppDbContext _dbContext;
    private readonly UserManager<ApiUser> _userManager;
    private readonly TokenCreation _tokenCreation;

    public AuthController
    (
        ILogger<AuthController> logger, 
        IMapper mapper, UserManager<ApiUser> userManager, 
        IConfiguration configuration, 
        AppDbContext dbContext,
        TokenCreation tokenCreation

    )
    {
        this._logger = logger;
        this._mapper = mapper;
        this._userManager = userManager;
        this._configuration = configuration;
        this._dbContext = dbContext;
        this._tokenCreation = new TokenCreation(_configuration, userManager);
    }


    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register(UserDto userDto)
    {
        _logger.LogInformation($"Registration attempt for {userDto.Email}");
        try
        {
            var user = _mapper.Map<ApiUser>(userDto);
            user.UserName = userDto.Email;
            var result = await _userManager.CreateAsync(user, userDto.Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return BadRequest(ModelState);
            }
            await _userManager.AddToRoleAsync(user, userDto.Role);
            return Accepted();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Something Went Wrong in the {nameof(Register)}");
            return Problem($"Seomthing Went Wrong in the {nameof(Register)}", statusCode: 500);
        }
    }

    [HttpPost]
    [Route("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginUserDto userDto)
    {
        _logger.LogInformation($"Login attempt for {userDto.Email}");
        try
        {
            var user = await _userManager.FindByEmailAsync(userDto.Email);
            if (user == null)
            {
                return Unauthorized("User not found.");
            }
            var passwordValid = await _userManager.CheckPasswordAsync(user, userDto.Password);
            if (!passwordValid)
            {
                return Unauthorized("Invalid password.");
            }
            string token = await _tokenCreation.GenerateToken(user);
            var existingToken = await _dbContext.UserTokens.Where(ut => ut.UserId== Convert.ToString(user.Id) && ut.TokenType == RefreshToken && !ut.IsRevoked)
                .FirstOrDefaultAsync();

            if (existingToken != null)
            {
                existingToken.Token = token;
                existingToken.Expiration = DateTime.UtcNow.AddHours(1);
                existingToken.CreatedAt = DateTime.UtcNow;
                existingToken.IsRevoked = true;

                _dbContext.UserTokens.Update(existingToken);
            }
            else
            {
                var newToken = new UserToken
                {
                    UserId = user.Id,
                    Token = token,
                    TokenType = RefreshToken,
                    Expiration = DateTime.UtcNow.AddHours(1),
                    CreatedAt = DateTime.UtcNow,
                    IsRevoked = false
                };
                await _dbContext.UserTokens.AddAsync(newToken);
            }
            await _dbContext.SaveChangesAsync();
            return new AuthResponse
            {
                Email = userDto.Email,
                Token = token,
                UserId = user.Id,
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Something Went Wrong in the {nameof(Login)}");
            return Problem($"Seomthing Went Wrong in the {nameof(Login)}", statusCode: 500);
        }
    }
}
