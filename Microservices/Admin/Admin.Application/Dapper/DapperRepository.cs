using Admin.Application.Dapper;
using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Threading.Tasks;

public class DapperRepository : IDapperRepository
    {
        private readonly IConfiguration _configuration;
        public DapperRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }


    public string GetConnectionString()
    {
        string connectionString = GetConnection().GetSection("ConnectionStrings").GetSection("DefaultConnection").Value;
        return connectionString;
    }

    public IConfigurationRoot GetConnection()
    {
        var builder = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appSettings.json").Build();
        return builder;
    }
    private IDbConnection CreateConnection()
    {
        string cn = GetConnectionString();
        return new SqlConnection(cn);
    }

    /// <summary>
    /// Return the collection of T type
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="sql"></param>
    /// <param name="parameters"></param>
    /// <returns></returns>

    public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object parameters = null)
        {
            using (var connection = CreateConnection())
            {
                try
                {
                    var QueryResponse = await connection.QueryAsync<T>(sql: sql, param: parameters, commandType: CommandType.StoredProcedure, commandTimeout: 180);
                    return QueryResponse;
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }


        public async Task<T> QueryFirstOrDefaultAsync<T>(string sql, object parameters = null)
        {
            using (var connection = CreateConnection())
            {
                try
                {
                    var QueryResponse = await connection.QueryFirstOrDefaultAsync<T>(sql: sql, param: parameters, commandType: CommandType.StoredProcedure, commandTimeout: 180);
                    return QueryResponse;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }

        public IEnumerable<T> Query<T>(string sql, object parameters = null)
        {
            using (var connection = CreateConnection())
            {
                try
                {
                    var QueryResponse =  connection.Query<T>(sql: sql, param: parameters, commandType: CommandType.StoredProcedure, commandTimeout: 180);
                    return QueryResponse;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }

        public void Command(string sql, object parameters = null)
        {
            using (var connection = CreateConnection())
            { 
                try
                {
                    var QueryResponse = connection.Execute(sql: sql, param: parameters, commandType: CommandType.StoredProcedure, commandTimeout: 180);
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }

        public bool Execute(string sql, object parameters = null)
        {
            using (var connection = CreateConnection())
            {
                try
                {
                    var QueryResponse = connection.Execute(sql: sql, param: parameters, commandType: CommandType.StoredProcedure, commandTimeout: 180);
                    return QueryResponse > 0 ? true : false;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }

        public bool ExecuteQuery(string sql, object parameters = null)
        {
            using (var connection = CreateConnection())
            {
                try
                {
                    var QueryResponse = connection.Execute(sql: sql, param: parameters, commandType: CommandType.Text, commandTimeout: 180);
                    return QueryResponse > 0 ? true : false;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }

        public SqlMapper.GridReader QueryMultiple(string sql, object parameters = null)
        {
            var connection = CreateConnection();
            try
            {
                var QueryResponse = connection.QueryMultiple(sql: sql, param: parameters, commandType: CommandType.StoredProcedure, commandTimeout: 180);
                return QueryResponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<T> PlainQuery<T>(string sql, object parameters = null)
        {
            using (var connection = CreateConnection())
            {
                try
                {
                    var QueryResponse = connection.Query<T>(sql: sql, param: parameters, commandType: CommandType.Text, commandTimeout: 180);
                    return QueryResponse;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }
    }