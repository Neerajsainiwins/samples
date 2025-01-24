using BlazorApp.Client.Components.Enums;
using BlazorApp.Client.Services.Service;
using BlazorApp.Shared.Models.Author;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.SignalR.Client;

namespace BlazorApp.Client.Components.Pages.Authors
{
    public partial class AuthorList
    {
        private ModalType modalType;
        private bool isModalVisible = false;
        private AuthorReadOnlyDTO currentAuthor = new AuthorReadOnlyDTO();
        private AuthorAddUpdateDTO addUpdateAuthor = new AuthorAddUpdateDTO();
        private int deleteAuthorId;
        private List<AuthorReadOnlyDTO> Authors = new List<AuthorReadOnlyDTO>();
        private string NameFilter = string.Empty;
        private int PageIndex = 1;
        private int PageSize = 5;
        private string SortBy = "FirstName";
        private string SortOrder = "asc";
        private int TotalPages;
        //private string NameFilter { get; set; }
        private Timer debounceTimer;
        private bool CanGoToPreviousPage => PageIndex > 1;
        private bool CanGoToNextPage => PageIndex < TotalPages;

        protected override async Task OnInitializedAsync()
        {
            await FetchAuthors();
            await InitializeSignalRConnection();

        }
        private async Task InitializeSignalRConnection()
        {
            hubConnection = new HubConnectionBuilder()
                .WithUrl(navigationManager.ToAbsoluteUri("http://localhost:5093/authorHub"))
                .Build();
            hubConnection.On<AuthorReadOnlyDTO, string>("ReceiveAuthorAdded", (author, email) =>
            {
                Authors.Add(author);
                InvokeAsync(StateHasChanged);
                ToastService.ShowToast($"New Author Added by {email}", ToastLevel.Success);
            });
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
        private async Task FetchAuthors()
        {
            var response = await authorService.GetAuthors(NameFilter, PageIndex, PageSize, SortBy, SortOrder);
            if (response != null)
            {
                Authors = response.AuthorData.ToList();
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
            await FetchAuthors();
        }
        private void OnInputChanged(ChangeEventArgs e)
        {
            NameFilter = e.Value?.ToString();
            debounceTimer?.Dispose();
            debounceTimer = new Timer(async _ =>
            {
                await ApplyFilter();
                InvokeAsync(StateHasChanged); 
            }, null, 300, Timeout.Infinite); 
        }
        private async Task ApplyFilter()
        {

            PageIndex = 1;
            Console.WriteLine($"Filter applied with value: {NameFilter}");
            await FetchAuthors();
        }


        private async Task PageSizeChanged(ChangeEventArgs e)
        {
            if (int.TryParse(e.Value?.ToString(), out int newPageSize))
            {
                PageSize = newPageSize;
                PageIndex = 1;
                await FetchAuthors();
            }
        }
        private async Task PreviousPage()
        {
            if (CanGoToPreviousPage)
            {
                PageIndex--;
                await FetchAuthors();
            }
        }

        private async Task NextPage()
        {
            if (CanGoToNextPage)
            {
                PageIndex++;
                await FetchAuthors();
            }
        }

        private void OpenModal(ModalType type, AuthorReadOnlyDTO author = null)
        {
            modalType = type;
            if (type == ModalType.Update || type == ModalType.View)
            {
                currentAuthor = author != null ? new AuthorReadOnlyDTO
                {
                    FirstName = author.FirstName,
                    LastName = author.LastName,
                    Bio = author.Bio,
                    Id = author.Id
                } : new AuthorReadOnlyDTO();
            }
            else if (type == ModalType.Delete)
            {
                deleteAuthorId = author?.Id ?? 0;
            }
            isModalVisible = true;
        }

        private void CloseModal()
        {
            isModalVisible = false;
            currentAuthor = new AuthorReadOnlyDTO();
        }

        private async Task SaveAuthor()
        {
            if (modalType == ModalType.Add)
            {
                addUpdateAuthor = Mapper.Map<AuthorAddUpdateDTO>(currentAuthor);

                await AddAuthors(addUpdateAuthor);
            }
            else if (modalType == ModalType.Update)
            {
                await UpdateAuthor(currentAuthor);
            }
        }

        private async Task AddAuthors(AuthorAddUpdateDTO author)
        {
            try
            {
                var response = await authorService.AddAuthor(author);
                if (response != null && response.Code == 200)
                {
                    ToastService.ShowToast("Author Added successfully!", ToastLevel.Success);
                    var addedAuthor = Mapper.Map<AuthorReadOnlyDTO>(currentAuthor);
                    var claimValue = (await getClaimsFromToken.GetClaims("email",null)).FirstOrDefault().Value;
                    if (!string.IsNullOrEmpty(claimValue))
                    {
                        await hubConnection.SendAsync("SendAuthorAdded", addedAuthor, claimValue.ToString());
                        await FetchAuthors();
                    }
                    else
                    {
                        ToastService.ShowToast("Failed to add author", ToastLevel.Error);
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

        private async Task UpdateAuthor(AuthorReadOnlyDTO author)
        {
            try
            {
                var response = await authorService.UpdateAuthor(author);
                if (response != null)
                {
                    ToastService.ShowToast("Author updated successfully!", ToastLevel.Success);
                    await FetchAuthors();
                }
                else
                {
                    ToastService.ShowToast("Failed to update author.", ToastLevel.Error);
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

        private async Task CancelDelete()
        {
            CloseModal();
        }

        private async Task ConfirmDeleteAuthor(int id)
        {
            try
            {
                var response = await authorService.DeleteAuthor(id);
                if (response != null && response.Code == 200)
                {
                    ToastService.ShowToast("Author deleted successfully!", ToastLevel.Success);
                    await FetchAuthors();
                }
                else
                {
                    ToastService.ShowToast("Failed to delete author.", ToastLevel.Error);
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
    }
}