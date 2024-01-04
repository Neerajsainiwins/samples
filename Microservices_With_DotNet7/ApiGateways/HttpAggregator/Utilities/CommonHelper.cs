using System.Collections.Specialized;

namespace HttpAggregator.Utilities
{
    public static class CommonHelper
    {
        public static NameValueCollection GetQueryParams<TSource>(this TSource source)
        {
            var queryString = System.Web.HttpUtility.ParseQueryString(string.Empty);
            var properties = source?.GetType().GetProperties();

            foreach (var prop in properties)
            {
                var value = prop.GetValue(source);
                if (value != null)
                {
                    queryString[prop.Name] = value.ToString();
                }
            }
            return queryString;
        }
    }
}
