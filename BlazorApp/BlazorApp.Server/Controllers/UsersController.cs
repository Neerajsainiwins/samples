using AutoMapper;
using BlazorApp.Server.Shared;
using BlazorApp.Shared.Models.PageResultModel;
using BlazorApp.Shared.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlazorApp.Server.Data;
using Microsoft.AspNetCore.Authorization;
using BlazorApp.Shared.Models.User;
using BlazorApp.Shared.Models.Author;
using Microsoft.AspNetCore.Identity;

namespace BlazorApp.Server.Controllers
{
  
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IEmailService _emailService;
        private readonly PagedResultService _pagedResultService;
        private readonly UserManager<ApiUser> _userManager;
        private readonly TokenCreation _tokenCreation;

        public UsersController(AppDbContext context, IMapper mapper, ILogger<UsersController> logger, PagedResultService pagedResultService, 
            UserManager<ApiUser> userManager, IEmailService emailService, TokenCreation tokenCreation)
        {
            _context = context;
            _emailService = emailService;   
            _mapper = mapper;
            _logger = logger;
            _pagedResultService = pagedResultService;
            _userManager = userManager;
            _tokenCreation = tokenCreation;  

        }
        [HttpGet]
        [Route("GetUserCount")]
        [Authorize(Roles = "Adminstrator")]
        public async Task<ActionResult> GetUserCount()
        {
            try
            {
                var userData = await _context.Users.ToListAsync();
                var users = userData.Count.ToString();
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error Performing while fetch the whole Data Get in {nameof(GetUserCount)}");
                throw new Exception(ex.Message);
            }

        }
        [HttpGet]
        public async Task<ActionResult<PagedResult<ApiUser>>> GetUsers(
        [FromQuery] string filter = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string sortBy = null,
        [FromQuery] string sortOrder = "asc"
    )
        {
            try
            {
                var query = _context.Users.AsQueryable();
                var pagedResult = await _pagedResultService.GetPagedResultAsync(query, filter, sortBy, sortOrder, page, pageSize);
                var userDto = _mapper.Map<IEnumerable<ApiUser>>(pagedResult.Data);
                return Ok(new
                {
                    Data = userDto,
                    Page = pagedResult.PageIndex,
                    PageSize = pagedResult.PageSize,
                    TotalPage = pagedResult.TotalPage,
                    TotalRecords = pagedResult.TotalRecords
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error Performing while fetch the whole Data Get in {nameof(GetUsers)}");
                throw new Exception(ex.Message);
            }

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CommonReadOnlyDtoVirtualizeResponse>> GetUsers(string id)
        {
            try
            {
                var users = await _context.Users.FindAsync(id);

                if (users == null)
                {
                    _logger.LogWarning($"Record NotFound: {nameof(GetUsers)} - ID: {id}");
                }
                var userDto = _mapper.Map<UserDto>(users);
                return Ok(new
                {
                    UserData = new[] { userDto }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error Performing while fetch the whole Data Get in {nameof(GetUsers)}");
                throw new Exception(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Adminstrator")]

        public async Task<ActionResult<CommonResponseModel>> PutUsers(string id, UserUpdateDTO userUpdateDTO)
        {
            //if (!ModelState.IsValid)
            //    return BadRequest(ModelState);

            if (string.IsNullOrEmpty(id))
            {
                _logger.LogWarning($"Update id Invalid in {nameof(PutUsers)} - ID: {id}");
                return new CommonResponseModel { Success = false, Message = "Invalid ID", Code = 504 };
            }
            var Users = await _context.Users.FindAsync(id);
            if (Users == null)
            {
                _logger.LogWarning($"Record not Found in {nameof(PutUsers)} - ID: {id}");
                return NotFound(new CommonResponseModel { Success = false, Message = "User not found", Code = 404 });
            }
            _mapper.Map(userUpdateDTO, Users);
            _context.Entry(Users).State = EntityState.Modified;
            try
            {
                var response = await _context.SaveChangesAsync();
                return Ok(new CommonResponseModel { Success = true, Message = "Update successful", Code = 200 });
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!await UsersExists(int.Parse(id)))
                {
                    return new CommonResponseModel { Success = false, Message = "User not found", Code = 404 };
                }
                else
                {
                    _logger.LogError(ex, $"Error Performing Update in {nameof(PutUsers)}");
                    return new CommonResponseModel { Success = false, Message = "Internal server error during update", Code = 500 };
                }
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Adminstrator")]

        public async Task<CommonResponseModel> DeleteUsers(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    _logger.LogWarning($"Delete Id Invalid in {nameof(DeleteUsers)} - ID: {id}");
                    return new CommonResponseModel { Success = false, Message = "Invalid ID", Code = 504 };
                }
                var Users = await _context.Users.FindAsync(id);
                if (Users == null)
                {
                    _logger.LogWarning($"Record not Found in {nameof(PutUsers)} - ID: {id}");
                    return new CommonResponseModel { Success = false, Message = "Record not found", Code = 500 };
                }

                _context.Users.Remove(Users);
                await _context.SaveChangesAsync();

                return new CommonResponseModel { Success = true, Message = $"Delete successful {id}", Code = 200 };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error Performing Delete  in {nameof(DeleteUsers)}");
                throw new Exception(ex.Message);
            }
        }

        [HttpPost("ChangePassword")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
                return NotFound("User not found");

            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok("Password changed successfully");
        }
        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
           
            var user = await _userManager.FindByIdAsync(request.UserId!);
            if (user == null)
                return NotFound("User not found");

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, resetToken, request.NewPassword!);
            if (!result.Succeeded)
                return BadRequest(result.Errors);
            user.SecurityStamp = Guid.NewGuid().ToString();
            await _userManager.UpdateAsync(user);

            return Ok("Password reset successfully");
         }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPassword request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return Ok("If the email is valid, a password reset link has been sent.");
            }
            var resetToken = await _tokenCreation.GenerateToken(user);
            var resetLink = $"https://localhost:7023/reset-password?token={System.Net.WebUtility.UrlEncode(resetToken)}";
            var response = _emailService.SendEmailAsync(user.Email!, "ResetPassword", resetLink);
            return Ok("If the email is valid, a password reset link has been sent.");
        }
        private async Task<bool> UsersExists(int id)
        {
            return await _context.Users.AnyAsync(e => e.Id == Convert.ToString(id));
        }
    }
}

