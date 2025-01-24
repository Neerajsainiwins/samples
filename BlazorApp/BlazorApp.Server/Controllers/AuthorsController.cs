using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using BlazorApp.Server.Data;
using BlazorApp.Server.Static;
using Microsoft.EntityFrameworkCore;
using BlazorApp.Shared.Models.Author;
using BlazorApp.Server.Shared;
using BlazorApp.Shared.Models.PageResultModel;
using BlazorApp.Server.Models.User;
using BlazorApp.Shared.Models;
namespace BlazorApp.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly AppDbContext _context;
        private readonly PagedResultService _pagedResultService;

        public AuthorsController(AppDbContext context, IMapper mapper, ILogger<AuthorsController> logger, PagedResultService pagedResultService)
        {
            _context = context;
            this._mapper = mapper;
            this._logger = logger;
            this._pagedResultService = pagedResultService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<AuthorReadOnlyDTO>>> GetAuthors
        (
            [FromQuery] string filter = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = null,
            [FromQuery] string sortOrder = "asc"
        )
        {
            try
            {
                var query = _context.Authors.AsQueryable();
                var pagedResult = await _pagedResultService.GetPagedResultAsync(query, filter, sortBy, sortOrder, page, pageSize);
                var authorDTO = _mapper.Map<IEnumerable<AuthorReadOnlyDTO>>(pagedResult.Data);
                return Ok(new
                {
                    AuthorData = authorDTO,
                    PageIndex = pagedResult.PageIndex,
                    TotalPages = pagedResult.TotalPage,
                    PageSize = pagedResult.PageSize,
                    //TotalRecords = pagedResult.TotalRecords
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error Performing while fetch the whole Data Get in {nameof(GetAuthors)}");
                throw new Exception($"Error Performing while fetch the whole Data Get. {ex.Message}");
            }

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Author>> GetAuthor(int id)
        {
            try
            {
                var author = await _context.Authors.FindAsync(id);

                if (author == null)
                {
                    _logger.LogWarning($"Record NotFound: {nameof(GetAuthor)} - ID: {id}");
                    throw new ArgumentNullException($"Record NotFound..!", nameof(author));
                }
                var authorDTO = _mapper.Map<AuthorReadOnlyDTO>(author);
                return Ok(authorDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error Performing while fetch the Data Get in {nameof(GetAuthors)}");
                throw new Exception($"Error Performing while fetch the Data.. {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Adminstrator")]

        public async Task<CommonResponseModel> PutAuthor(int id, AuthorAddUpdateDTO authorUpdateDTO)
        {
             if (id <= 0)
            {
                _logger.LogWarning($"Update id Invalid in {nameof(PutAuthor)} - ID: {id}");
                return new CommonResponseModel { Success = false, Message = "Invalid ID", Code = 504 };
            }

            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                _logger.LogWarning($"Record not Found in {nameof(PutAuthor)} - ID: {id}");
                return new CommonResponseModel { Success = false, Message = "Record not found", Code = 500 };
            }

            _mapper.Map(authorUpdateDTO, author);
            _context.Entry(author).State = EntityState.Modified;

            try
            {
                var response = await _context.SaveChangesAsync();
                return new CommonResponseModel { Success = true, Message = "Update successful", Code = 200, };
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!await AuthorExists(id))
                {
                    return new CommonResponseModel { Success = false, Message = "Author not found", Code = 304 };
                }
                else
                {
                    _logger.LogError(ex, $"Error Performing Update in {nameof(PutAuthor)}");
                    return new CommonResponseModel { Success = false, Message = "Internal server error during update" };
                }
            }
        }

        [HttpPost]
        [Authorize(Roles = "Adminstrator")]

        public async Task<CommonResponseModel> PostAuthor(AuthorAddUpdateDTO authorAddDTO)
        {
            try
            {
                if (authorAddDTO == null)
                {
                    return new CommonResponseModel
                    {
                        Success = false,
                        Message = "Invalid data. AuthorDTO cannot be null.",
                        Code = 400
                    };
                }
                var author = _mapper.Map<Author>(authorAddDTO);

                await _context.Authors.AddAsync(author);
                await _context.SaveChangesAsync();

                return new CommonResponseModel
                {
                    Success = true,
                    Message = "Author created successfully.",
                    Code = 200,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating the author.");

                return new CommonResponseModel
                {
                    Success = false,
                    Message = "An error occurred while creating the author.",
                    Code = 500,
                    ValidationErrors = ex.Message
                };
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Adminstrator")]

        public async Task<CommonResponseModel> DeleteAuthor(int id)
        {
            try
            {
                if (id == 0)
                {
                    _logger.LogWarning($"Delete Id Invalid in {nameof(DeleteAuthor)} - ID: {id}");
                    return new CommonResponseModel { Success = false, Message = "Invalid ID", Code = 504 };
                }
                var author = await _context.Authors.FindAsync(id);
                if (author == null)
                {
                    _logger.LogWarning($"Record not Found in {nameof(PutAuthor)} - ID: {id}");
                    return new CommonResponseModel { Success = false, Message = "Record not found", Code = 500 };
                }

                _context.Authors.Remove(author);
                await _context.SaveChangesAsync();

                return new CommonResponseModel { Success = true, Message = $"Delete successful {id}", Code = 200 };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error Performing Delete  in {nameof(DeleteAuthor)}");
                return new CommonResponseModel { Success = false, Message = "Internal server error during update" };
            }
        }

        [HttpGet]
        [Route("GetAuthorCount")]
        [Authorize(Roles = "Adminstrator")]
        public async Task<ActionResult> GetAuthorCount()
        {
            try
            {
                var authorData = await _context.Authors.ToListAsync();
                var userData = await _context.Users.ToListAsync();
                var authors = authorData.Count.ToString();
                return Ok(authors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error Performing while fetch the whole Data Get in {nameof(GetAuthorCount)}");
                return StatusCode(500, Messages.Error500Message);
            }

        }
        private async Task<bool> AuthorExists(int id)
        {
            return await _context.Authors.AnyAsync(e => e.Id == id);
        }
    }
}
