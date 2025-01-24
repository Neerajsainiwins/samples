using BlazorApp.Client.Components.Enums;
using BlazorApp.Client.Providers;
using BlazorApp.Client.Services.Service;
using BlazorApp.Shared.Models.Book;
using Microsoft.AspNetCore.SignalR.Client;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace BlazorApp.Client.Components.Pages.Books
{
    public partial class BookList
    {
        private List<BookReadOnlyDTO> Books = new List<BookReadOnlyDTO>();
        private string NameFilter = string.Empty;
        private int PageIndex = 1;
        private int PageSize = 100;
        private string SortBy = "Title";
        private string SortOrder = "asc";
        private int TotalPages;
        private ModalType modalType;
        private bool isModalVisible = false;
        private BookReadOnlyDTO currentBook = new BookReadOnlyDTO();
        private BookReadOnlyDTO viewBook = new BookReadOnlyDTO();
        private BookAddUpdateDTO addUpdateBook = new BookAddUpdateDTO();

        protected override async Task OnInitializedAsync()
        {
            await FetchBooks();
            await InitializeSignalRConnection();
        }

        private async Task InitializeSignalRConnection()
        {
            hubConnection = new HubConnectionBuilder()
                .WithUrl(navigationManager.ToAbsoluteUri("http://localhost:5093/bookHub"))
                .Build();
            hubConnection.On<BookReadOnlyDTO, string>("ReceiveBookAdded", (book, email) =>
            {
                Books.Add(book);
                InvokeAsync(StateHasChanged);
                ToastService.ShowToast($"New Book Added by {email}", ToastLevel.Success);
            });
            hubConnection.Closed += async (error) =>
            {
                Console.WriteLine("Connection closed due to error: " + (error?.Message ?? "Unknown"));
                await Task.Delay(5000);
                await StartConnectionAsync();
            };
            await StartConnectionAsync();
            PageIndex = 1;
        }
        private async Task StartConnectionAsync()
        {
            try
            {
                await hubConnection.StartAsync();
                Console.WriteLine("SignalR connection established.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error starting connection: " + ex.Message);
                await Task.Delay(5000);
                await StartConnectionAsync();
            }
        }

        public async ValueTask DisposeAsync()
        {
            await hubConnection.DisposeAsync();
        }
        private async Task FetchBooks()
        {
            var response = await bookService.GetBooks(NameFilter, PageIndex, PageSize, SortBy, SortOrder);
            if (response != null)
            {
                Books = response.BookData.ToList();
                TotalPages = response.TotalPages;
                PageSize = response.PageSize;
                PageIndex = response.PageIndex;
            }
        }

        private async Task ApplySorting(string column)
        {
            if (SortBy == column)
            {
                SortOrder = SortOrder == "asc" ? "desc" : "asc";
            }
            else
            {
                SortBy = column;
                SortOrder = "asc";
            }
            PageIndex = 1;
            await FetchBooks();
        }

        private async Task SaveBook()
        {
            if (modalType == ModalType.Add)
            {
                addUpdateBook = Mapper.Map<BookAddUpdateDTO>(currentBook);
                await AddBooks(addUpdateBook);
            }
        }
        private async Task AddBooks(BookAddUpdateDTO addUpdateBook)
        {
            try
            {
                var response = await bookService.AddBooks(addUpdateBook);
                if (response != null && response.Code == 200)
                {
                    ToastService.ShowToast("Book Added successfully!", ToastLevel.Success);
                    var claimValue = (await getClaimsFromToken.GetClaims("email", null)).FirstOrDefault().Value;
                    if (!string.IsNullOrEmpty(claimValue))
                    {
                        await hubConnection.SendAsync("SendBookAdded", Mapper.Map<BookReadOnlyDTO>(currentBook), claimValue.ToString());
                        await FetchBooks();
                    }
                    else
                    {
                        ToastService.ShowToast("Failed to add Book", ToastLevel.Error);
                    }
                }
            }
            catch (Exception ex)
            {
                ToastService.ShowToast($"Error: {ex.Message}", ToastLevel.Error);
            }
            finally
            {
                CloseModal();
            }
        }

        private void OpenModal(ModalType type, BookReadOnlyDTO? book = null)
        {
            modalType = type;
            if (type == ModalType.Update || type == ModalType.View)
            {
                currentBook = book != null ? new BookReadOnlyDTO
                {
                    Title = book.Title,
                    Year = book.Year,
                    ISBN = book.ISBN,
                    Summary = book.Summary,
                    Price = book.Price
                } : new BookReadOnlyDTO();
            }
            isModalVisible = true;
        }

        private void CloseModal()
        {
            isModalVisible = false;
            currentBook = new BookReadOnlyDTO();
        }
    }
}