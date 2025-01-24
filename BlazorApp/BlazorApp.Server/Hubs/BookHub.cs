using BlazorApp.Shared.Models.Book;
using Microsoft.AspNetCore.SignalR;

namespace BlazorApp.Server.Hubs
{
    public class BookHub : Hub
    {
        public async Task SendBookAdded(BookReadOnlyDTO book, string email)
        {
            Console.WriteLine($"Sending book: {book.Title}, {book.Year}, to email: {email}");
            await Clients.Others.SendAsync("ReceiveBookAdded", book, email);
        }
    }
}
