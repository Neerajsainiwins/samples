using Admin.Core.Entities.Base;
using Admin.Core.Repositories.Base;
using Admin.Infrastructure.Data;

namespace Admin.Infrastructure.Repository.Base
{
    public class Repository<T> : RepositoryBase<T, int>, IRepository<T>
        where T : class, IEntityBase<int>
    {
        public Repository(AdminDbContext context)
            : base(context)
        {
        }
    }
}
