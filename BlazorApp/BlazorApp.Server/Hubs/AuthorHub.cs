using BlazorApp.Server.Data;
using BlazorApp.Shared.Models.Author;
using BlazorApp.Shared.Models.Book;
using Microsoft.AspNetCore.SignalR;

namespace BlazorApp.Server.Hubs
{
    public class AuthorHub : Hub
    {
        public async Task SendAuthorAdded(AuthorReadOnlyDTO author, string email)
        {
            Console.WriteLine($"Sending book: {author.FirstName}, {author.LastName}, to email: {email}");
            await Clients.Others.SendAsync("ReceiveAuthorAdded", author, email);
        }
    }
}
