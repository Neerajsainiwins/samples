using KeyCloak.API.DTOs;
using MediatR;

namespace KeyCloak.API.Command.Create
{
    public class CreateUserCommand : IRequest<bool>
    {
        public CreateUserDto CreateUserDto { get; set; }
        public CreateUserCommand(CreateUserDto createUserDto)
        {
            CreateUserDto = createUserDto;
        }
    }
}