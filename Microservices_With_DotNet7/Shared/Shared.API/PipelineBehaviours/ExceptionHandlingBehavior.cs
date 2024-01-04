using MediatR;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace Shared.PipelineBehaviours
{
    public class ExceptionHandlingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    {
        private readonly ILogger<ExceptionHandlingBehavior<TRequest, TResponse>> _logger;

        public ExceptionHandlingBehavior(ILogger<ExceptionHandlingBehavior<TRequest, TResponse>> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            try
            {
                // Continue the pipeline
                return await next();
            }
            catch (Exception ex)
            {
                // Log the exception
                _logger.LogError(ex, "Exception occurred while handling {RequestType}", typeof(TRequest).Name);

                // Optionally, you can perform additional handling, such as notifying developers, sending emails, etc.

                // Rethrow the exception (optional)
                throw;
            }
        }
    }
}


