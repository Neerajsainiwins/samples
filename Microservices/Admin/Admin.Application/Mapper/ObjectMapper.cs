using Admin.Application.Models;
using Admin.Core.Entities;
using AutoMapper;
using Admin.Application.Models.Base;

namespace Admin.Application.Mapper
{
    public class ObjectMapper
    {
        public static IMapper Mapper => AutoMapper.Mapper.Instance;

        static ObjectMapper()
        {
            CreateMap();
        }

        private static void CreateMap()
        {
            AutoMapper.Mapper.Initialize(cfg =>
            {
                //cfg.CreateMap<Screens, MenuModel>().ReverseMap();
                cfg.CreateMap<TenantConfigurations, TenantModel>().ReverseMap();
                cfg.CreateMap<TenantModel, TenantConfigurations>().ReverseMap();
            });
        }
    }
}
