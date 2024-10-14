using KeyCloak.API.Infrastructure.Entities;
using KeyCloak.API.Queries;
using KeyCloak.API.Services;
using MediatR;

namespace KeyCloak.API.QueryHandler
{
    public class GetUserQueryHandler : IRequestHandler<GetUserQuery, List<Users>>
    {
        private readonly IUserService _userService;
        public GetUserQueryHandler(IUserService userService)
        {
            _userService = userService;
        }
        public async Task<List<Users>> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var response = await _userService
                    .GetAll()
                    .ConfigureAwait(false);

            return response;
        }
    }
}
