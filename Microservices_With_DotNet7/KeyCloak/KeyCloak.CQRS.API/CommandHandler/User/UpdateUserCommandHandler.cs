using BCommerce.KeyCloak.API.Command.Create;
using BCommerce.KeyCloak.API.Services;
using MediatR;

namespace BCommerce.KeyCloak.API.CommandHandler.User
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