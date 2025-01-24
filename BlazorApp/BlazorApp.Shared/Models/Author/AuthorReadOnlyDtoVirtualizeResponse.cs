using BlazorApp.Shared.Data;
using BlazorApp.Shared.Models.Book;
using BlazorApp.Shared.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazorApp.Shared.Models.Author
{
    public class CommonReadOnlyDtoVirtualizeResponse
    {
        public List<AuthorReadOnlyDTO> AuthorData { get; set; }
        public List<BookReadOnlyDTO> BookData { get; set; }
        //public List<ApiUser> ApiUsers { get; set; }
        public List<UserDto> UserData { get; set; }
        public List<CommonResponseModel> CommonResponseModel { get; set; }
        public int Code { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalRecords { get; set; }
    }
}
