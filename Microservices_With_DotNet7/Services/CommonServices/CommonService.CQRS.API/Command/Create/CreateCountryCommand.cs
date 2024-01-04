using MediatR;

namespace CommonService.API.Command.Create
{
    public class CreateCountryCommand : IRequest<int>
    {
        public CreateCountryDto CreateCountryDto { get; set; }
        public CreateCountryCommand()
        {
        }

        public CreateCountryCommand(CreateCountryDto CreatecountryDto)
        {
            CreateCountryDto = CreatecountryDto;
        }
    }
}