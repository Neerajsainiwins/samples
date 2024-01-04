using MediatR;

namespace CommonService.API.Command.Edit
{
    public class EditCountryCommand : IRequest<int>
    {
        public EditCountryCommand()
        {
        }

        public EditCountryCommand(EditCountyDto editCountyDto)
        {
            EditCountyDto = editCountyDto;
        }   

        public EditCountyDto EditCountyDto { get; set; }
    }
}