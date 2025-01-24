using BlazorApp.Shared.Models;
using BlazorApp.Shared.Models.Author;
using BlazorApp.Shared.Models.Book;

namespace BlazorApp.Client.Services.IService
{
    public interface IBookService
    {
        Task<CommonReadOnlyDtoVirtualizeResponse> GetBooks(string NameFilter, int Page, int PageSize, string SortBy, string SortOrder);
        Task<CommonResponseModel> AddBooks(BookAddUpdateDTO bookAddUpdateDTO);
        Task<int> GetBookTotalCount();

    }
}
