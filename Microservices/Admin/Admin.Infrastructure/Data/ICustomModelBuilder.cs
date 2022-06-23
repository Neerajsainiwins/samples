using Microsoft.EntityFrameworkCore;

namespace Admin.Infrastructure.Data
{
    public interface ICustomModelBuilder
    {
        void Build(ModelBuilder modelBuilder);
    }
}
