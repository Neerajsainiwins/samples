using BlazorApp.Shared.Models.Author;
using BlazorApp.Client.Shared;
using BlazorApp.Shared.Models;
using Blazored.SessionStorage;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Authorization;
using BlazorApp.Client.Services.IService;

public class AuthorService(HttpService httpService, ISessionStorageService sessionStorageService, AuthenticationStateProvider authenticationStateProvider) : IAuthorService
{
    private readonly HttpService _httpService = httpService;
    private ISessionStorageService _sessionStorageService = sessionStorageService;
    private readonly AuthenticationStateProvider _authenticationStateProvider = authenticationStateProvider;

    public async Task<CommonReadOnlyDtoVirtualizeResponse> GetAuthors(string NameFilter, int Page, int PageSize, string SortBy, string SortOrder)
    {
        try
        {
            var url = $"http://localhost:5093/api/Authors?page={Page}&pageSize={PageSize}&sortBy={SortBy}&sortOrder={SortOrder}";

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

    public async Task<CommonResponseModel> UpdateAuthor(AuthorReadOnlyDTO authorReadOnlyDTO)
    {
        try
        {
            var response = await _httpService.Put<CommonResponseModel>($"http://localhost:5093/api/Authors/{authorReadOnlyDTO.Id}", authorReadOnlyDTO);
            return response;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
    public async Task<CommonResponseModel> DeleteAuthor(int id)
    {
        try
        {
            var response = await _httpService.Delete<CommonResponseModel>($"http://localhost:5093/api/Authors/{id}");
            return response;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
    public async Task<AuthorReadOnlyDTO> GetAuthorById(int id)
    {
        var response = await _httpService.Get<AuthorReadOnlyDTO>($"http://localhost:5093/api/Authors/{id}");
        return response;
    }
    public async Task<CommonResponseModel> AddAuthor(AuthorAddUpdateDTO authorAddDTO)
    {
        var response = await _httpService.Post<CommonResponseModel>("http://localhost:5093/api/Authors", authorAddDTO);
        return response;
    }
    public async Task<int> GetAuthorTotalCount()
    {
        try
        {
            var response= await _httpService.Get<string>($"http://localhost:5093/api/Authors/GetAuthorCount");
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
            throw new Exception($"Error: {ex.Message}");
        }
    }
}
