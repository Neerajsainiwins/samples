using BlazorApp.Server.Models.User;
using BlazorApp.Shared.Models;
using BlazorApp.Shared.Models.Author;
using BlazorApp.Shared.Models.User;
using BlazorApp.Client.Services.IService;
using BlazorApp.Client.Shared;

namespace BlazorApp.Client.Services.User
{
    public class UserService : IUserService
    {
        private readonly HttpService _httpService;

        public UserService(HttpService httpService)
        {
            _httpService = httpService;
        }

        public async Task<CommonReadOnlyDtoVirtualizeResponse> GetUsers(string NameFilter, int Page, int PageSize, string SortBy, string SortOrder)
        {
            try
            {
                var url = $"http://localhost:5093/api/Users?page={Page}&pageSize={PageSize}&sortBy={SortBy}&sortOrder={SortOrder}";

                if (!string.IsNullOrEmpty(NameFilter))
                {
                    url += $"&filter={NameFilter}";
                }

                return await _httpService.Get<CommonReadOnlyDtoVirtualizeResponse>(url);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task<CommonResponseModel> UpdateUser(UserDto userDto, string Id)
        {
            try
            {
                var response = await _httpService.Put<CommonResponseModel>($"http://localhost:5093/api/Users/{Id}", userDto);
                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<CommonResponseModel> DeleteUser(string id)
        {
            try
            {
                var response = await _httpService.Delete<CommonResponseModel>($"http://localhost:5093/api/Users/{id}");
                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<int> GetUserTotalCount()
        {
            try
            {
                var response = await _httpService.Get<string>($"http://localhost:5093/api/Users/GetUserCount");
                if (int.TryParse(response, out int count))
                {
                    return count;
                }
                else
                {
                    throw new Exception($"The response '{response}' could not be converted to an integer.");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<CommonReadOnlyDtoVirtualizeResponse> GetUserById(string id)
        {
            try
            {
                var response = await _httpService.Get<CommonReadOnlyDtoVirtualizeResponse>($"http://localhost:5093/api/Users/{id}");
                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<HttpResponseMessage> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            try
            {
                var response = await _httpService.Post<HttpResponseMessage>("http://localhost:5093/api/Users/ChangePassword", changePasswordDto);

                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}