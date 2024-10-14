using KeyCloak.API.Infrastructure.Entities;
using MediatR;

namespace KeyCloak.API.Queries
{
    public class GetUserQuery : IRequest<List<Users>>
    {
        public GetUserQuery()
        {
        }
    }
}
