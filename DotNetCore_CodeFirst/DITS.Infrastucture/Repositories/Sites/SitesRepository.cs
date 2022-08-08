using DITS.Core.Helpers;
using DITS.Core.DTOs.Sites.Request;
using DITS.Core.DTOs.Sites.Response;
using DITS.Core.DTOs.Common.Response;
using DITS.Core.DTOs.Common.Ṛesponse;
using DITS.Core.Interfaces.Sites;
using DITS.Core.Organisations;
using DITS.Infrastucture.Data;
using Microsoft.EntityFrameworkCore;
using DITS.Core.Entities.Organisation;
using Microsoft.Extensions.Logging;

namespace DITS.Infrastucture.Repositories.Sites
{
    public class SitesRepository : ISitesRepository
    {
        private readonly Context _dbContext;
        private readonly ILogger<SitesRepository> _logger;
        public SitesRepository(Context dbContext, ILogger<SitesRepository> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        /// <summary>
        /// This method is used to fetch list of sites of logged in user.
        /// </summary>
        public GetUserSiteDetailsResponse GetUserSiteDetails(string loggedInUserId)
        {
            GetUserSiteDetailsResponse response = new GetUserSiteDetailsResponse();
            var userSiteDetails = (from steUsr in _dbContext.OrganisationSiteUsers
                                   where steUsr.UserId == loggedInUserId
                                   select new GetUserSiteDetailsModel
                                   {
                                       UserId = steUsr.UserId,
                                       UserName = steUsr.User.UserName,
                                       Roles = (from ur in _dbContext.UserRoles
                                                where ur.UserId == steUsr.UserId
                                                select new RolesModel
                                                {
                                                    RoleId = ur.RoleId,
                                                    RoleName = ur.Role.Name
                                                }).ToList(),
                                       Organisations = (from orgUsr in _dbContext.OrganisationUsers
                                                        join org in _dbContext.Organisations on orgUsr.OrganisationId equals org.OrganisationId
                                                        where orgUsr.UserId == steUsr.UserId
                                                        select new OrganisationModel
                                                        {
                                                            OrganisationId = org.OrganisationId,
                                                            OrganisationName = org.OrganisationName,
                                                            OrganisationSites = _dbContext.OrganisationSites.Where(x => x.OrganisationId == orgUsr.OrganisationId).AsNoTracking()
                                                            .Select(x => new OrganisationSitesModel { OrganisationSiteId = x.OrganisationSiteId, OrganisationSiteName = x.OrganisationSiteName }).ToList()

                                                        }).ToList()
                                   }).ToList();
            response.Data = userSiteDetails;
            return response;
        }       
    }
}
