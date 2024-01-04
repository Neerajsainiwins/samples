using AutoMapper;
using CommonService.API.Application.UnitOfWork;
using MediatR;

namespace CommonService.API.CommandHandler.Country
{
    public class EditCountryCommandHandler : IRequestHandler<EditCountryCommand, int>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public EditCountryCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<int> Handle(EditCountryCommand request, CancellationToken cancellationToken)
        {
            Country country = _unitOfWork.GetRepository<Country>().GetFirstOrDefault(c => c.Id == request.EditCountyDto.Id, tracked: false);
            if (country != null)
            {
                Country contryEdit = _mapper.Map<EditCountyDto, Country>(request.EditCountyDto);
                _unitOfWork.GetRepository<Country>().Update(contryEdit);
                await _unitOfWork.CommitChangesAndLogsAsync(country, contryEdit);
                return contryEdit.Id;
            }
            return 0;
        }
    }
}