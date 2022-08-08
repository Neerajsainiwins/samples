using DITS.Core.Helpers;
using DITS.Application.Sites.Interfaces;
using DITS.Core.DTOs.Sites.Request;
using DITS.Core.DTOs.Sites.Response;
using DITS.Core.Interfaces.Sites;
using DITS.Core.DTOs.Common.Response;

namespace DITS.Application.Sites
{
    public class SiteServices : ISitesService
    {
        private readonly ISitesRepository _sitesRepository;
        public SiteServices(ISitesRepository sitesRepository)
        {
            _sitesRepository = sitesRepository;
        }

        public async Task<CommonResponse> CreateOrganisationSites(CreateSitesDTO createSitesDTO, string loggedInUserId)
        {
            try
            {
                return await _sitesRepository.CreateOrganisationSites(createSitesDTO, loggedInUserId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<CommonResponse> UpdateOrganisationSites(UpdateSitesDTO updateSitesDTO, string loggedInUserId)
        {
            try
            {
                return await _sitesRepository.UpdateOrganisationSites(updateSitesDTO, loggedInUserId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<GetOrganisationSitesByOrganisationIdResponse> GetOrganisationSitesByOrganisationId(Guid organisationId)
            => await _sitesRepository.GetOrganisationSitesByOrganisationId(organisationId);

        public async Task<PagingHelper<GetOrganisationSiteDetailsList>> GetOrganisationSiteDetails(GetOrganisationSitesAssociatedWithUserDTO paginationDTO)
            => await _sitesRepository.GetOrganisationSiteDetails(paginationDTO);

        public GetOrganisationSiteBySiteIdResponse GetOrganisationSitesBySiteId(Guid organisationSiteId) => _sitesRepository.GetOrganisationSitesBySiteId(organisationSiteId);

        public async Task<PagingHelper<GetOrgnSitesByOrgIdAndUserId>> GetOrgSitesByOrgIdAndUserId(GetOrgSitesByOrgIdAndUserIdRequestDTO paginationDTO) 
            => await _sitesRepository.GetOrgSitesByOrgIdAndUserId(paginationDTO);
        public GetUserSiteDetailsResponse GetUserSiteDetails(string loggedInUserId) => _sitesRepository.GetUserSiteDetails(loggedInUserId);

        public async Task<CommonResponse> DeleteOrganisationSites(Guid organisationSiteId)
        {
            try
            {
                return await _sitesRepository.DeleteOrganisationSites(organisationSiteId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
