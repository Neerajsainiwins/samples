using KeyCloak.API.DTOs;
using MediatR;

namespace KeyCloak.API.Command.Create
{
    public class UpdateUserCommand : IRequest<bool>
    {
        public UpdateUserDto UpdateUserDto { get; set; }
        public UpdateUserCommand(UpdateUserDto updateUserDto)
        {
            UpdateUserDto = updateUserDto;
        }
    }
}