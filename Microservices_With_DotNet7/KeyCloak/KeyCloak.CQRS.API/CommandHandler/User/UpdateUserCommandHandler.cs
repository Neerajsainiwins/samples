using Project.KeyCloak.API.Command.Create;
using Project.KeyCloak.API.Services;
using MediatR;

namespace Project.KeyCloak.API.CommandHandler.User
{
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, bool>
    {
        private readonly IUserService _userService;
        public UpdateUserCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<bool> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
          return  await _userService.UpdateUser(request.UpdateUserDto);
        }
    }
}