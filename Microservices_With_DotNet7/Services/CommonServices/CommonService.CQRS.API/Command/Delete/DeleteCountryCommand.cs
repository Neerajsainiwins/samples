using MediatR;

namespace CommonService.API.Command.Delete
{
    public class DeleteCountryCommand: IRequest<bool>
    {
        public DeleteCountryCommand()
        {
        }

        public DeleteCountryCommand(int id)
        {
            Id = id;
        }   

        public int Id { get; set; }
    }
}