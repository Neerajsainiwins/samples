namespace KeyCloak.API.Services
{
    public interface IUserService
    {
        Task<ApiOkResponse> GetAllUsers();
        Task<ApiOkResponse> GetUsersById(string userId);
    }
}