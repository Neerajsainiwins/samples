using Admin.Core.Entities.Base;
using Admin.Core.Repositories.Base;
using Admin.Infrastructure.Data;

namespace Admin.Infrastructure.Repository.Base
{
    public class EnumRepository<T> : RepositoryBase<T, int>, IEnumRepository<T>
        where T : class, IEntityBase<int>
    {
        public EnumRepository(AdminDbContext context)
            : base(context)
        {
        }
    }
}
