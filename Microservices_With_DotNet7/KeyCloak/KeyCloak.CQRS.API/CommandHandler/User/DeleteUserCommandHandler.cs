using Project.KeyCloak.API.Command.Create;
using Project.KeyCloak.API.Services;
using MediatR;

namespace Project.KeyCloak.API.CommandHandler.User
{
    public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, bool>
    {
        private readonly IUserService _userService;
        public DeleteUserCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
          return  await _userService.DeleteUser(request.UserId);
        }
    }
}