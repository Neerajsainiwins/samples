using Shared.Types;
using Shared.ValueObjects;
using MediatR;

namespace CommonService.API.Queries.Country
{
    public class GetCountriesQuery: IRequest<PagedList<Country>>
    {
        public GetCountriesQuery(PagingDTO pagingModel)
        {
            PagingDTO = pagingModel;
        }
        public PagingDTO PagingDTO { get; set; }
    }
}
