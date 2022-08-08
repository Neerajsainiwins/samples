using AutoMapper;
using DITS.Core.DTOs.Users.Request;
using DITS.Core.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Common.AutoMapper
{
    public class CreateServiceMap : Profile
    {
        public CreateServiceMap()
        {
            CreateMap<UserDetailsDTO, UserDetail>().ReverseMap();
        }
    }
}
