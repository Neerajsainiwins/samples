using BlazorApp.Shared.Models;
using BlazorApp.Shared.Models.Author;
namespace BlazorApp.Client.Services.IService
{
    public interface IAuthorService
    {
        Task<CommonReadOnlyDtoVirtualizeResponse> GetAuthors(string NameFilter, int Page, int PageSize, string SortBy, string SortOrder);
        Task<CommonResponseModel> UpdateAuthor(AuthorReadOnlyDTO authorReadOnlyDTO);
        Task<CommonResponseModel> DeleteAuthor(int id);
        Task<AuthorReadOnlyDTO> GetAuthorById(int id);
        Task<CommonResponseModel> AddAuthor(AuthorAddUpdateDTO authorAddDTO);
        Task<int> GetAuthorTotalCount();

        //Task<Response<List<AuthorReadOnlyDTO>>> Get();
        //Task<Response<AuthorDetailsDto>> Get(int id);
        //Task<Response<AuthorUpdateDto>> GetForUpdate(int id);
        //Task<Response<int>> Create(AuthorCreateDto author);
        //Task<Response<int>> Edit(int id, AuthorUpdateDto author);
        //Task<Response<int>> Delete(int id);
    }
}
