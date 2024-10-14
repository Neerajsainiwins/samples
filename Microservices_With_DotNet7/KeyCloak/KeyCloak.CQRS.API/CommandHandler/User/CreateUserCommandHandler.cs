using Project.KeyCloak.API.Command.Create;
using Project.KeyCloak.API.Services;
using MediatR;

namespace Project.KeyCloak.API.CommandHandler.User
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