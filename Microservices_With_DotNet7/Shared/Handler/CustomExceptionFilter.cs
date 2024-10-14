using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System.Net;

namespace Shared.Handler
{
    public class CustomExceptionFilter : Microsoft.AspNetCore.Mvc.Filters.IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            var response = new { error = context.Exception.Message };
            var payload = JsonConvert.SerializeObject(response);
            context.Result = new ContentResult
            {
                Content = payload,
                ContentType = "application/json",
                StatusCode = (int)HttpStatusCode.InternalServerError
            };
            context.ExceptionHandled = true;
        }
    }
}