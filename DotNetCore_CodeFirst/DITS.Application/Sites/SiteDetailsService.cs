using DITS.Application.Sites.Interfaces;
using DITS.Core.DTOs.Sites;
using DITS.Core.Interfaces.Sites;
using DITS.Core.ViewModel.OrganisationSites;

namespace DITS.Application.Sites
{
    public class SiteDetailsService : ISiteDetailsService
    {
        private readonly ISiteDetailsRepository _siteDetailsRepository;

        public SiteDetailsService(ISiteDetailsRepository siteDetailsRepository)
        {
            _siteDetailsRepository = siteDetailsRepository;
        }

        public async Task<IQueryable<SiteDetailsResponseDTO>> GetSiteDetails(SiteDetailsParametersModel siteDetailsParameters)
            => await _siteDetailsRepository.GetSiteDetails(siteDetailsParameters);
    }
}
