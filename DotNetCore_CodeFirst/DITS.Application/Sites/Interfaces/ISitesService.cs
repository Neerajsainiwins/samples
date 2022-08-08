using DITS.Core.Helpers;
using DITS.Core.DTOs.Sites.Request;
using DITS.Core.DTOs.Sites.Response;
using DITS.Core.DTOs.Common.Response;

namespace DITS.Application.Sites.Interfaces
{
    public interface ISitesService
    {
        GetUserSiteDetailsResponse GetUserSiteDetails(string loggedInUserId);
    }
}
