using BCommerce.DataAccess.Shared.Interfaces;

namespace BCommerce.CommonService.API.Application.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        Task CommitChangesAsync();
        Task CommitChangesAndLogsAsync<TEntity>(TEntity oldEntity, TEntity newEntity) where TEntity : class;
        void Rollback();
        IRepository<TEntity> GetRepository<TEntity>() where TEntity : class;
    }
}