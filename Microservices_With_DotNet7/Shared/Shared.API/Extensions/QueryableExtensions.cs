using BCommerce.Shared.Utilities;
using System.Linq.Expressions;

namespace BCommerce.Shared.Extensions
{
    public static class QueryableExtensions
    {
        public static IOrderedQueryable<T> OrderByDynamic<T>(this IQueryable<T> source, string propertyName, string orderType)
        {
            // Implementation to dynamically create an expression based on propertyName
            // This could involve using Expression Trees to create an expression for sorting
            string sortType = orderType.ToUpper() == Sorting.DESC ? Sorting.OrderByDescending : Sorting.OrderBy;
            var parameter = Expression.Parameter(typeof(T));
            var property = Expression.Property(parameter, propertyName);
            var lambda = Expression.Lambda(property, parameter);
            var expression = Expression.Call(
                typeof(Queryable),
                sortType,
                new[] { typeof(T), property.Type }, // Specify type arguments explicitly
                source.Expression,
                Expression.Quote(lambda)
            );

            return (IOrderedQueryable<T>)source.Provider.CreateQuery(expression);
        }
    }
}