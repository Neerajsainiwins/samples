using BCommerce.KeyCloak.API.Command.Create;
using BCommerce.KeyCloak.API.Services;
using MediatR;

namespace BCommerce.KeyCloak.API.CommandHandler.User
{
    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, bool>
    {
        private readonly IUserService _userService;
        public CreateUserCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<bool> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            return await _userService.CreateUser(request.CreateUserDto);
        }
    }
}