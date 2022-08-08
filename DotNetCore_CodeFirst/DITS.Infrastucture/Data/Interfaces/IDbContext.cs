using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Infrastucture.Data.Interfaces
{
    public interface IDbContext
    {
        IQueryable<T> Set<T>() where T : class;
    }

    
}
