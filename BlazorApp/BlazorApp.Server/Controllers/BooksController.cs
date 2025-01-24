using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using BlazorApp.Server.Data;
using AutoMapper.QueryableExtensions;
using BlazorApp.Shared.Models.Book;
using BlazorApp.Shared.Models.PageResultModel;
using BlazorApp.Server.Shared;
using BlazorApp.Shared.Models;

namespace BlazorApp.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly ILogger logger;
        private readonly AppDbContext _context;
        private readonly PagedResultService pagedResultService;

        public BooksController(AppDbContext context, IMapper mapper, ILogger<BooksController> logger, PagedResultService pagedResultService)
        {
            _context = context;
            this.mapper = mapper;
            this.logger = logger;
            this.pagedResultService = pagedResultService;

        }

        [HttpGet]
        [Route("GetBookCount")]
        [Authorize(Roles = "Adminstrator")]
        public async Task<ActionResult> GetBookCount()
        {
            try
            {
                var bookData = await _context.Books.ToListAsync();
                var books = bookData.Count.ToString();
                return Ok(books);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error Performing while fetch the whole Data Get in {nameof(GetBookCount)}");
                throw new Exception($"rror Performing while fetch the whole Data..{ex.Message}");
            }
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<BookReadOnlyDTO>>> GetBooks
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
                var query = _context.Books.AsQueryable();
                var pagedResult = await pagedResultService.GetPagedResultAsync(query, filter, sortBy, sortOrder, page, pageSize);
                var bookDto = mapper.Map<IEnumerable<BookReadOnlyDTO>>(pagedResult.Data);
                return Ok(new
                {
                    BookData = bookDto,
                    Page = pagedResult.PageIndex,
                    PageSize = pagedResult.PageSize,
                    TotalPage = pagedResult.TotalPage,
                    TotalRecords = pagedResult.TotalRecords
                });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error Performing while fetch the whole Data Get in {nameof(GetBooks)}");
                throw new Exception(ex.Message);
            }

        }
        [HttpGet("{id}")]
        public async Task<ActionResult<BookDetailsDTO?>> GetBook(int id)
        {
            try
            {
                var book = await _context.Books
                                .Include(q => q.Author)
                                .ProjectTo<BookDetailsDTO>(mapper.ConfigurationProvider)
                                   .FirstOrDefaultAsync();
                if (book == null)
                {
                    logger.LogWarning($"Record NotFound: {nameof(GetBook)} - ID: {id}");
                }

                return book;
            }
            catch (Exception ex)
            {

                logger.LogError(ex, $"Error Performing while fetch the whole Data Get in {nameof(GetBook)}");
                throw new Exception(ex.Message);
            }

        }


        [HttpPut("{id}")]
        [Authorize(Roles = "Adminstrator")]

        public async Task<IActionResult> PutBook(int id, BookAddUpdateDTO bookDTO)
        {
            var book = await _context.Books.FindAsync(id);
            if (string.IsNullOrEmpty(book?.ToString()))
            {
                logger.LogWarning($"Record NotFound: {nameof(BookUpdateDTO)} - ID: {id}");
            }
            mapper.Map(bookDTO, book);
            if (book is Book)
            {
                _context.Entry(book).State = EntityState.Modified;
            }
            else
            {
                throw new InvalidOperationException("The entity is not of type Book.");
            }
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await BookExistsAsync(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        private Task<bool> BookExistsAsync(int id)
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        [Authorize(Roles = "Adminstrator")]

        public async Task<CommonResponseModel> PostBook(BookAddUpdateDTO bookAddDTO)
        {
            try
            {
                var book = mapper.Map<Book>(bookAddDTO);
                _context.Books.Add(book);
                await _context.SaveChangesAsync();

                return new CommonResponseModel
                {
                    Success = true,
                    Message = "Book created successfully.",
                    Code = 200,
                };
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error Performing while Post the Data in {nameof(PostBook)}");
                return new CommonResponseModel
                {
                    Success = false,
                    Message = "An error occurred while creating the book.",
                    Code = 500,
                    ValidationErrors = ex.Message
                };
            }

        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Adminstrator")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            try
            {
                var book = await _context.Books.FindAsync(id);
                if (book == null)
                {
                    logger.LogWarning($"Record is  NotFound to Delete: {nameof(DeleteBook)} - ID: {id}");
                    return NotFound();
                }

                _context.Books.Remove(book);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error Performing while Delete the Data in {nameof(DeleteBook)}");
                throw new Exception(ex.Message);
            }
        }

        private async Task<bool> BookExists(int id)
        {
            return await _context.Books.AnyAsync(e => e.BookId == id);
        }
    }
}
