using AutoMapper;
using BlazorApp.Server.Data;
using BlazorApp.Shared.Models.Author;
using BlazorApp.Shared.Models.Book;
using BlazorApp.Server.Models.User;
using BlazorApp.Shared.Models.User;

namespace BlazorApp.Server.Configurations
{
    public class MapperConfig : Profile
    {
        public MapperConfig()

        {
            CreateMap<AuthorAddUpdateDTO, Author>().ReverseMap().AddTransform<string>(s => string.IsNullOrWhiteSpace(s) ? "" : s.Trim());
            CreateMap<AuthorReadOnlyDTO, Author>().ReverseMap().AddTransform<string>(s => string.IsNullOrWhiteSpace(s) ? "" : s.Trim()); ;

            //Books
            CreateMap<BookAddUpdateDTO, Book>().ReverseMap().AddTransform<string>(s => string.IsNullOrWhiteSpace(s) ? "" : s.Trim()); ;
            CreateMap<BookUpdateDTO, Book>().ReverseMap().AddTransform<string>(s => string.IsNullOrWhiteSpace(s) ? "" : s.Trim()); ;
            CreateMap<Book, BookReadOnlyDTO>().ForMember(q => q.AuthorName, d => d.MapFrom(map => map.Author != null ? $"{map.Author.FirstName} {map.Author.LastName}" : "UnknownAuthor")).ReverseMap();
            CreateMap<Book, BookDetailsDTO>().ForMember(q => q.AuthorName, d => d.MapFrom(map => map.Author != null ? $"{map.Author.FirstName} {map.Author.LastName}" : "UnknownAuthor")).ReverseMap();

            //Auth ApiUser
            CreateMap<ApiUser, UserDto>().ReverseMap();
            CreateMap<UserUpdateDTO, ApiUser>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        }
    }
}
