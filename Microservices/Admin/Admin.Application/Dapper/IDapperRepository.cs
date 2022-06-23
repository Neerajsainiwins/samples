using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Admin.Application.Dapper
{
    public  interface IDapperRepository
    {

        Task<IEnumerable<T>> QueryAsync<T>(string sql, object parameters = null);
        Task<T> QueryFirstOrDefaultAsync<T>(string sql, object parameters = null);
        IEnumerable<T> Query<T>(string sql, object parameters = null);
        void Command(string sql, object parameters = null);
        bool Execute(string sql, object parameters = null);
        bool ExecuteQuery(string sql, object parameters = null);

        SqlMapper.GridReader QueryMultiple(string sql, object parameters = null);

        IEnumerable<T> PlainQuery<T>(string sql, object parameters = null);

    }
}
