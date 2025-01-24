using System.Linq.Expressions;
using BlazorApp.Shared.Models.PageResultModel;
using Microsoft.EntityFrameworkCore;

namespace BlazorApp.Server.Shared
{
    public class PagedResultService
    {
        public async Task<PagedResult<T>> GetPagedResultAsync<T>(IQueryable<T> query, string? filter = null, string? sortBy = null, string sortOrder = "asc", int page = 1, int pageSize = 10)
        {
            if (!string.IsNullOrEmpty(filter))
            {
                var properties = typeof(T).GetProperties()
                .Where(p => p.PropertyType == typeof(string))
                .ToList();

                if (properties.Any())
                {
                    var parameter = Expression.Parameter(typeof(T), "x");
                    var containsMethod = typeof(DbFunctionsExtensions).GetMethod("Like", new[] { typeof(DbFunctions), typeof(string), typeof(string) });

                    Expression? filterExpression = null;

                    foreach (var property in properties)
                    {
                        var propertyAccess = Expression.MakeMemberAccess(parameter, property);
                        var likeExpression = Expression.Call(null, containsMethod!, Expression.Constant(EF.Functions), propertyAccess, Expression.Constant($"%{filter}%"));

                        filterExpression = filterExpression == null
                        ? (Expression)likeExpression
                        : Expression.OrElse(filterExpression, likeExpression);
                    }

                    var lambda = Expression.Lambda<Func<T, bool>>(filterExpression!, parameter);
                    query = query.Where(lambda);
                }
            }

            var totalRecords = await query.CountAsync();
            var data = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

            if (!string.IsNullOrEmpty(sortBy))
            {
                data = ApplySorting(data, sortBy, sortOrder, page);
            }

            return new PagedResult<T>
            {
                Data = data,
                PageIndex = page,
                PageSize = pageSize,
                TotalPage= (int)Math.Ceiling(totalRecords / (double)pageSize),
                TotalRecords = totalRecords
            };
        }

        private List<T> ApplySorting<T>(List<T> query, string sortBy, string sortOrder, int page)
        {
            var property = typeof(T).GetProperty(sortBy);
            if (property != null)
            {
                query = sortOrder.ToLower() == "asc"
                   ? query.OrderBy(x => property.GetValue(x, null)).ToList()
                   : query.OrderByDescending(x => property.GetValue(x,null)).ToList();
            }
            return query;
        }
    }
}
