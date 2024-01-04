using BCommerce.KeyCloak.API.Infrastructure.Entities;
using MediatR;

namespace BCommerce.KeyCloak.API.Queries
{
    public class GetUserQuery : IRequest<List<Users>>
    {
        public GetUserQuery()
        {
        }
    }
}
