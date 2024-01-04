using BCommerce.KeyCloak.API.Infrastructure.Entities;
using BCommerce.KeyCloak.API.Queries;
using BCommerce.KeyCloak.API.Services;
using MediatR;

namespace BCommerce.KeyCloak.API.QueryHandler
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
