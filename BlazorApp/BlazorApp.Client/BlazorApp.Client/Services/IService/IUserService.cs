using BlazorApp.Shared.Models;
using BlazorApp.Server.Models.User;
using BlazorApp.Shared.Models.User;
using BlazorApp.Shared.Models.Author;

namespace BlazorApp.Client.Services.IService
{
    public interface IUserService
    {
        Task<CommonReadOnlyDtoVirtualizeResponse> GetUsers(string NameFilter, int Page, int PageSize, string SortBy, string SortOrder);
        Task<CommonResponseModel> UpdateUser(UserDto userDto, string Id);
        Task<CommonResponseModel> DeleteUser(string id);
        Task<int> GetUserTotalCount();
        Task<CommonReadOnlyDtoVirtualizeResponse> GetUserById(string id);
        Task<HttpResponseMessage> ChangePassword(ChangePasswordDto changePasswordDto);
    }
}
