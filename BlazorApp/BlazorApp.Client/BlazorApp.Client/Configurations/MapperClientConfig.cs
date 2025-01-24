using AutoMapper;
using BlazorApp.Shared.Models.Author;
using BlazorApp.Shared.Models.Book;
namespace BlazorApp.Client.Configurations
{
    public class MapperClientConfig : Profile
    {
        public MapperClientConfig()
        {
            CreateMap<AuthorReadOnlyDTO, AuthorAddUpdateDTO>().ReverseMap().AddTransform<string>(s => string.IsNullOrWhiteSpace(s) ? "" : s.Trim());
            CreateMap<BookReadOnlyDTO, BookAddUpdateDTO>().ReverseMap().AddTransform<string>(s => string.IsNullOrWhiteSpace(s) ? "" : s.Trim());
        }
    }
}
