using Admin.Core.Entities.Base;

namespace Admin.Core.Repositories.Base
{
    public interface IRepository<T> : IRepositoryBase<T, int> where T : IEntityBase<int>
    {
    }
}
