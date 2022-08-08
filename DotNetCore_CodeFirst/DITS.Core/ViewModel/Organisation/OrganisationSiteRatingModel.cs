namespace DITS.Core.ViewModel.Organisation
{
    public class OrganisationSiteRatingModel
    {
        public Guid OrganisationSiteId { get; set; }
        public Guid DataCycleId { get; set; }
        public decimal? OrganisationSiteRating { get; set; }
    }
}
