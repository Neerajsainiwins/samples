using CommonService.API.Application.UnitOfWork;
using MediatR;

namespace CommonService.API.CommandHandler.Country
{
    public class DeleteCountryCommandHandler : IRequestHandler<DeleteCountryCommand, bool>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteCountryCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(DeleteCountryCommand request, CancellationToken cancellationToken)
        {
            try
            {
                Country country = _unitOfWork.GetRepository<Country>().GetFirstOrDefault(c => c.Id == request.Id);
                if (country != null)
                {
                    _unitOfWork.GetRepository<Country>().Remove(country);
                    await _unitOfWork.CommitChangesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}