namespace Shared.Utilities
{
    public static class ExceptionHelper
    {
        public static void ThrowCustomException(string message) 
        {
            throw new ApplicationException(message);
        }
    }
}