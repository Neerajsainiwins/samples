using Admin.Core.Entities;
using Admin.Core.Repositories;
using Admin.Core.RequestModel;
using Admin.Infrastructure.Data;
using Admin.Infrastructure.Repository.Base;
using DefaultAPIPackage.API.Models;
using DefaultAPIPackage.Controllers;
using DefaultAPIPackage.DTOs;
using DefaultAPIPackage.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Admin.Infrastructure.Repository
{
    public class MenuRepository : /*Repository<Screen>,*/ IMenuRepository
    {
        private readonly ScreensController _screensController;
        private readonly AdminDbContext _context;
        public MenuRepository(AdminDbContext context, ScreensController screensController)
            //: base(context)
        {
            _context = context;
            _screensController= screensController;
        }

        public Task<IEnumerable<Screen>> GetMenuList()
        {
            throw new NotImplementedException();
        }

        //public async Task<IEnumerable<Screen>> GetMenuList()
        //{
        //    var menuList = await ListAllAsync();
        //    return menuList;
        //}

        public async Task<IEnumerable<GetScreenResponse>> GetScreens(Core.RequestModel.GetScreensModel model, int tenantId)
        {
            GetScreens screens = new GetScreens();
            screens.TenantId = tenantId;
            //screens.RoleId = _context.Where(x => x.UserId == model.UserId).Select(x => x.RoleId).FirstOrDefault();
            return await _screensController.GetScreens(screens);
        }
    }
    
}
