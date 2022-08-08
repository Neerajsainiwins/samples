using AuthIdentityServer.Models.AccountViewModels;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Infrastructure.Validators.Register
{
    public class REgisterDTOValidation : AbstractValidator<RegisterViewModel>
    {
        public REgisterDTOValidation()
        {
            RuleFor(x => x.User.FirstName).NotEmpty();
            RuleFor(x => x.User.LastName).NotEmpty();
            RuleFor(x => x.User.UserName).NotEmpty();
            //RuleFor(x => x.User.ProfileImage).NotEmpty();
            //RuleFor(x => x.User.Country).NotEmpty();
            //RuleFor(x => x.User.State).NotEmpty();
            //RuleFor(x => x.User.City).NotEmpty();
            //RuleFor(x => x.User.ZipCode).NotEmpty();
            //RuleFor(x => x.User.Street).NotEmpty();
        }
    }
}
