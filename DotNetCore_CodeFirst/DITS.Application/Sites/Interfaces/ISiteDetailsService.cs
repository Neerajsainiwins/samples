using DITS.Core.DTOs.Sites;
using DITS.Core.ViewModel.OrganisationSites;

namespace DITS.Application.Sites.Interfaces
{
    public interface ISiteDetailsService
    {
        Task<IQueryable<SiteDetailsResponseDTO>> GetSiteDetails(SiteDetailsParametersModel siteDetailsParameters);
    }
}
