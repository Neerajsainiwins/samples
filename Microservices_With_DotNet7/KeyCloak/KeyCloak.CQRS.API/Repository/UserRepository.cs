using BCommerce.KeyCloak.API.Infrastructure.Context;
using BCommerce.KeyCloak.API.Infrastructure.Entities;
using System.Linq.Expressions;

namespace BCommerce.KeyCloak.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context)
        {
            _context = context;
        }
        public void Create(Users entity)
        {
            _context.Users.Add(entity);
            _context.SaveChanges();
        }

        public void Delete(Users entity)
        {
            _context.Users.Remove(entity);
            _context.SaveChanges();
        }

        public IQueryable<Users> FindAll()
        {
            return _context.Users;
        }

        public IQueryable<Users> FindByCondition(Expression<Func<Users, bool>> expression)
        {
            return _context.Users.Where(expression);
        }

        public void Update(Users entity)
        {
            _context.Users.Update(entity);
            _context.SaveChanges();
        }
    }
}
