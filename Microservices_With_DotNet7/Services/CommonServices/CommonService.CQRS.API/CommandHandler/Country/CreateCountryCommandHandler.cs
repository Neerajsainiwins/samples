using AutoMapper;
using CommonService.API.Application.UnitOfWork;
using MediatR;

namespace CommonService.API.CommandHandler.Country
{
    public class CreateCountryCommandHandler : IRequestHandler<CreateCountryCommand, int>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CreateCountryCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<int> Handle(CreateCountryCommand request, CancellationToken cancellationToken)
        {
            Country contryCreate = _mapper.Map<CreateCountryDto, Country>(request.CreateCountryDto);
            _unitOfWork.GetRepository<Country>().Add(contryCreate);
            await _unitOfWork.CommitChangesAsync();
            return contryCreate.Id;
        }
    }
}