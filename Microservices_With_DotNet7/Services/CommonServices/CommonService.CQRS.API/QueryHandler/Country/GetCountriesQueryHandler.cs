using CommonService.API.Application.UnitOfWork;
using CommonService.API.Queries.Country;
using Shared.Extensions;
using Shared.Types;
using MediatR;

namespace CommonService.API.QueryHandler.Country
{
    public class GetCountriesQueryHandler : IRequestHandler<GetCountriesQuery, PagedList<Country>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetCountriesQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<PagedList<Country>> Handle(GetCountriesQuery request, CancellationToken cancellationToken)
        {
            var countries = _unitOfWork.GetRepository<Country>().GetAll();

            var queryableList = countries.AsQueryable();

            return queryableList.OrderByDynamic(request.PagingDTO.OrderBy, request.PagingDTO.OrderType).ToPagedList(request.PagingDTO.PageNo, request.PagingDTO.PageSize);
        }
    }
}