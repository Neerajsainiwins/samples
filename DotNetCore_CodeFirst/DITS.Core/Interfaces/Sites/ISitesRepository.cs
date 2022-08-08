using DITS.Core.DTOs.Sites.Request;
using DITS.Core.DTOs.Sites.Response;
using DITS.Core.Helpers;
using DITS.Core.DTOs.Common.Response;

namespace DITS.Core.Interfaces.Sites
{
    public interface ISitesRepository
    {
        GetUserSiteDetailsResponse GetUserSiteDetails(string loggedInUserId);
    }
}
