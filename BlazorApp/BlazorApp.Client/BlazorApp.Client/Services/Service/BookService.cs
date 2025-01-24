using BlazorApp.Shared.Models.Author;
using BlazorApp.Client.Services.IService;
using BlazorApp.Client.Shared;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components;
using Blazored.SessionStorage;
using BlazorApp.Shared.Models;
using BlazorApp.Shared.Models.Book;

namespace BlazorApp.Client.Services.Service
{
    public class BookService(HttpService httpService, NavigationManager navigationManager, ISessionStorageService sessionStorageService, AuthenticationStateProvider authenticationStateProvider) : IBookService
    {
        private readonly HttpService _httpService = httpService;
        private ISessionStorageService __sessionStorageService = sessionStorageService;
        private NavigationManager _navigationManager = navigationManager;
        private readonly AuthenticationStateProvider _authenticationStateProvider = authenticationStateProvider;
        public AuthorReadOnlyDTO User { get; private set; }

        public async Task<int> GetBookTotalCount()
        {
            try
            {
                var response = await _httpService.Get<string>($"http://localhost:5093/api/Books/GetBookCount");
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

        public async Task<CommonReadOnlyDtoVirtualizeResponse> GetBooks(string NameFilter, int Page, int PageSize, string SortBy, string SortOrder)
        {
            try
            {
                var url = $"http://localhost:5093/api/Books?page={Page}&pageSize={PageSize}&sortBy={SortBy}&sortOrder={SortOrder}";

                if (!string.IsNullOrEmpty(NameFilter))
                {
                    url += $"&filter={NameFilter}";
                }

                return await _httpService.Get<CommonReadOnlyDtoVirtualizeResponse>(url);
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        public async Task<CommonResponseModel> AddBooks(BookAddUpdateDTO bookAddUpdateDTO)
        {
            var response = await _httpService.Post<CommonResponseModel>("http://localhost:5093/api/Books", bookAddUpdateDTO);
            return response;
        }
    }
}
