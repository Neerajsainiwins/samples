using DITS.Core.Helpers;

namespace DITS.Core.ViewModel.OrganisationSites
{
    public class SiteDetailsParametersModel : QueryStringParameters
    {
        public SiteDetailsParametersModel()
        {
            OrderBy = "OrganisationSiteName";
        }
        public string OrganisationSiteName { get; set; }
        public string UserName { get; set; }
    }
}
