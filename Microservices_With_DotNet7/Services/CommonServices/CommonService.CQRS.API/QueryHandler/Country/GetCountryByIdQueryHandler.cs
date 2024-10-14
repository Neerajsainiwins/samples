using AutoMapper;
using CommonService.API.Application.UnitOfWork;
using CommonService.API.Queries.Country;
using MediatR;

namespace Project.CommonService.API.QueryHandler.Country
{
    public class GetCountryByIdQueryHandler : IRequestHandler<GetCountryByIdQuery, GetCountriesDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public GetCountryByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public Task<GetCountriesDto> Handle(GetCountryByIdQuery request, CancellationToken cancellationToken)
        {
            Country country = _unitOfWork.GetRepository<Country>().GetFirstOrDefault(c => c.Id == request.CountryId);
            country ??= new Country();
            GetCountriesDto countryData = _mapper.Map<Country, GetCountriesDto>(country);
            return Task.FromResult(countryData);
        }
    }
}