using DITS.Core;
using DITS.Core.ApiAuthTokens;
using DITS.Core.DataCycles;
using DITS.Core.Entities.DataCycles;
using DITS.Core.Entities.Organisations;
using DITS.Core.Entities.Language;
using DITS.Core.Entities.Organisation;
using DITS.Core.Entities.SurveyTemplate;
using DITS.Core.Helpers;
using DITS.Core.Indicators;
using DITS.Core.Organisations;
using DITS.Core.Questions;
using DITS.Core.Reports;
using DITS.Core.SurveyResponse;
using DITS.Core.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DITS.Infrastucture.Data
{
    public class Context : IdentityDbContext<ApplicationUser, ApplicationRole, string, IdentityUserClaim<string>,
                ApplicationUserRole, IdentityUserLogin<string>, IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        public Context(DbContextOptions<Context> options)
            : base(options)
        {
        }

        public virtual DbSet<ApiAuthToken> ApiAuthTokens { get; set; } = null!;
        public virtual DbSet<DataCycle> DataCycle { get; set; } = null!;
        public virtual DbSet<DataCycleNotes> DataCycleNotes { get; set; } = null!;
        public virtual DbSet<DataCycleParticipantSummary> DataCycleParticipantSummary { get; set; } = null!;
        public virtual DbSet<EmailTemplate> EmailTemplate { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //if (!optionsBuilder.IsConfigured)
            //{
            //    optionsBuilder.UseSqlServer(@"Server=.\SQLExpress;Database=DevEngage;Integrated Security=SSPI;MultipleActiveResultSets=True;");
            //}
        }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
