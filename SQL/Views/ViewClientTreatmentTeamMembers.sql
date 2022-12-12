if object_id('dbo.ViewClientTreatmentTeamMembers') is not null
  drop view dbo.ViewClientTreatmentTeamMembers;
go

create view [dbo].[ViewClientTreatmentTeamMembers]
as
select tt.ClientId,
       tt.MemberId,
       tt.MemberName,
       tt.TeamRole,
       isnull(gc.CodeName, '<Unknown Team Role>') + isnull(': ' + tt.TeamRoleName, '') + case when tt.TeamRole < 10000 then '*'
                                                                                              else ''
                                                                                         end as TeamRoleName, -- Identity core roles with *
       tt.StartDate,
       tt.EndDate,
       tt.Active,
       tt.MemberType,
       tt.AssociatedScreenPrimaryKeyId,
       tt.IsCoreRole,
	   gc.CodeName
	   ,tt.ProgramId
from   (

         -- Primary Clinician
         select c.ClientId,
                s.StaffId as MemberId,
                s.LastName + ', ' + s.FirstName as MemberName,
                9551 as TeamRole,
                null as TeamRoleName,
                cast(getdate() as date) as StartDate,
                null as EndDate,
                'Y' as Active,
                'S' as MemberType,
                c.ClientId as AssociatedScreenPrimaryKeyId,
                'Y' as IsCoreRole
				,NULL as ProgramId
         from   Clients c
                join Staff s on s.StaffId = c.PrimaryClinicianId
         where  isnull(c.RecordDeleted, 'N') = 'N'
                and isnull(s.RecordDeleted, 'N') = 'N'
         union all
         -- Medical Provider
         select c.ClientId,
                s.StaffId,
                s.LastName + ', ' + s.FirstName,
                9552,
                null,
                cast(getdate() as date) as StartDate,
                null as EndDate,
                'Y' as Active,
                'S',
                c.ClientId,
                'Y' as IsCoreRole
				,NULL as ProgramId
         from   Clients c
                join Staff s on s.StaffId = c.PrimaryPhysicianId
         where  isnull(c.RecordDeleted, 'N') = 'N'
                and isnull(s.RecordDeleted, 'N') = 'N'
         union all
         -- Program Assignment Staff
         select cp.ClientId,
                s.StaffId,
                s.LastName + ', ' + s.FirstName,
                9553,
                p.ProgramName,
                CAST(cp.EnrolledDate AS DATE) as StartDate,
                CAST(cp.DischargedDate AS DATE) as EndDate,
                'Y' as Active,
                'S',
                cp.ClientProgramId,
                'Y' as IsCoreRole
				,cp.ProgramId as ProgramId
         from   ClientPrograms cp
                join Staff s on s.StaffId = cp.AssignedStaffId
                join Programs p on p.ProgramId = cp.ProgramId
         where  isnull(cp.RecordDeleted, 'N') = 'N'
                and isnull(s.RecordDeleted, 'N') = 'N'
                and cp.Status = 4 -- Enrolled
         union all
         -- Treatment Team Episode Staff
         select te.ClientId,
                s.StaffId,
                s.LastName + ', ' + s.FirstName,
                9554,
                isnull(gct.CodeName, '<Unknown Type>') + ' - ' + isnull(sa.ServiceAreaName, '<Unknown Service Area>'),
                CAST(te.RegistrationDate AS DATE) as StartDate,
                CAST(te.DischargeDate AS DATE) as EndDate,
                case when gcs.ExternalCode1 = 'Active' then 'Y'
                     else 'N'
                end,
                'S',
                te.TreatmentEpisodeId,
                'Y' as IsCoreRole
				,NULL as ProgramId
         from   TreatmentEpisodes te
                join Staff s on s.StaffId = te.StaffAssociatedId
                left join GlobalCodes gcs on gcs.GlobalCodeId = te.TreatmentEpisodeStatus
                left join ServiceAreas sa on sa.ServiceAreaId = te.ServiceAreaId
                left join GlobalCodes gct on gct.GlobalCodeId = te.TreatmentEpisodeType
         where  isnull(te.RecordDeleted, 'N') = 'N'
                and isnull(s.RecordDeleted, 'N') = 'N'
         union all
         -- Family Placement
         select fp.ClientId,
                pf.PlacementFamilyId,
                pf.FamilyName,
                9555,
                null,
                CAST(fp.PlacementStart AS DATE) as StartDate,
                CAST(fp.PlacementEnd AS DATE) as EndDate,
                'Y',
                'F',
                fp.FosterPlacementId,
                'Y' as IsCoreRole
				,NULL as ProgramId
         from   FosterPlacements fp
                join PlacementFamilies pf on pf.PlacementFamilyId = fp.PlacementFamilyId
         where  isnull(fp.RecordDeleted, 'N') = 'N'
         union all
         -- Foster Care Specialist
         select fp.ClientId,
                s.StaffId,
                s.LastName + ', ' + s.FirstName,
                9556,
                null,
                CAST(fp.PlacementStart AS DATE) as StartDate,
                CAST(fp.PlacementEnd AS DATE) as EndDate,
                'Y',
                'S',
                fp.FosterPlacementId,
                'Y' as IsCoreRole
				,NULL as ProgramId
         from   FosterPlacements fp
                join Staff s on s.StaffId = fp.FosterCareSpecialist
                join GlobalCodes gc on gc.GlobalCodeId = 9555 -- Family Placement
         where  isnull(fp.RecordDeleted, 'N') = 'N'
                and isnull(s.RecordDeleted, 'N') = 'N'
         union all
         -- Inpatient Therapist
         select civ.ClientId,
                s.StaffId,
                s.LastName + ', ' + s.FirstName,
                9557,
                null,
                CAST(civ.AdmitDate AS DATE) as StartDate,
                CAST(civ.DischargedDate AS DATE) as EndDate,
                'Y',
                'S',
                civ.ClientInpatientVisitId,
                'Y' as IsCoreRole
				,NULL as ProgramId
         from   ClientInpatientVisits civ
                join Staff s on s.StaffId = civ.ClinicianId
         where  civ.Status = 4982 -- Admitted
                and isnull(civ.RecordDeleted, 'N') = 'N'
                and isnull(s.RecordDeleted, 'N') = 'N'
         union all
         -- Inpatient Attending
         select civ.ClientId,
                s.StaffId,
                s.LastName + ', ' + s.FirstName,
                9558,
                null,
                CAST(civ.AdmitDate AS DATE) as StartDate,
                CAST(civ.DischargedDate AS DATE) as EndDate,
                'Y',
                'S',
                civ.ClientInpatientVisitId,
                'Y' as IsCoreRole
				,NULL as ProgramId
         from   ClientInpatientVisits civ
                join Staff s on s.StaffId = civ.PhysicianId
         where  civ.Status = 4982 -- Admitted
                and isnull(civ.RecordDeleted, 'N') = 'N'
                and isnull(s.RecordDeleted, 'N') = 'N'
         union all
         -- Treatment Team Member
         select tt.ClientId,
                case tt.MemberType
                     when 'S' then tt.StaffId
                     when 'C' then cc.ClientContactId
                     else tt.ClientTreatmentTeamMemberId
                end,
                case tt.MemberType
                     when 'S' then s.LastName + ', ' + s.FirstName
                     when 'C' then cc.LastName + ', ' + cc.FirstName
                     else isnull(tt.LastName, '') + isnull(', ' + tt.FirstName, '')
                end,
                coalesce(tt.TreatmentTeamRole, p.TreatmentTeamRole),
                null,
                CAST(tt.StartDate AS DATE) AS StartDate,
                CAST(tt.EndDate AS DATE) AS EndDate,
                isnull(tt.Active, 'Y'),
                tt.MemberType,
                tt.ClientTreatmentTeamMemberId,
                'N' as IsCoreRole
				,tt.ProgramId
         from   ClientTreatmentTeamMembers tt
                left join GlobalCodes gc on gc.GlobalCodeId = tt.TreatmentTeamRole
                left join Staff s on s.StaffId = tt.StaffId
                                     and tt.MemberType = 'S'
                                     and isnull(s.RecordDeleted, 'N') = 'N'
				left join StaffPreferences p on p.Staffid = s.Staffid
                left join ClientContacts cc on cc.ClientContactId = tt.ClientContactId
                                               and tt.MemberType = 'C'
                                               and isnull(cc.RecordDeleted, 'N') = 'N'
         where  isnull(tt.RecordDeleted, 'N') = 'N') as tt
       left join GlobalCodes gc on gc.GlobalCodeId = tt.TeamRole;
go