using System.Collections.Generic;

namespace Admin.Core.RequestModel
{
    public class DeleteRoles
    {
        public List<int> RoleId { get; set; }
    }
    public class DeleteRoleIds
    {
        public int RoleIds { get; set; }
    }
}
