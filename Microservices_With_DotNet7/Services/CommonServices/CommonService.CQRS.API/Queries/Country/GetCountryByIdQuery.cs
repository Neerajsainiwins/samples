using CommonService.API.DTOs.Country;
using MediatR;

namespace CommonService.API.Queries.Country
{
    public class GetCountryByIdQuery : IRequest<GetCountriesDto>
    {
        public GetCountryByIdQuery(int countryId)
        {
            CountryId = countryId;
        }
        public int CountryId { get; set; }
    }

}
