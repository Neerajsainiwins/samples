using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Entities.Response
{
   public  class GetDropdownResponse
    {
        public List<GenderList> GenderList { get; set; }
        public List<MaritalStatusList> MaritalStatusList { get; set; }

        public List<ReligionList> ReligionList { get; set; }

        public List<NationalityList> NationalityList { get; set; }

        public List<BloodGroupList> BloodGroupList { get; set; }
        
        public List<StateList> StateList { get; set; }
        public List<CityList> CityList { get; set; }

        public List<CountryList> CountryList { get; set; }

        public List<OccupationList> OccupationList { get; set; }

        public List<QualificationTypeList> QualificationTypeList { get; set; }

        public List<CourseList> CourseList { get; set; }

        public List<OrganizationList> OrganizationList { get; set; }
        public List<RelationList> RelationList { get; set; }

        public List<CategoryList> CategoryList { get; set; }

        public List<PriorityList> PriorityList { get; set; }
        public List<TaskStatusList> TaskStatusList { get; set; }
        public List<UsersList> UsersList { get; set; }


    }

    public class GenderList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }
    public class MaritalStatusList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }

    public class ReligionList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }

    public class NationalityList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }

    public class BloodGroupList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }

    public class CityList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }

    public class StateList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }

    public class CountryList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }


    public class RelationList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }

    public class OccupationList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }

    public class QualificationTypeList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }

    public class CourseList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }

    public class OrganizationList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }


    public class CategoryList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }

    public class PriorityList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }

    public class TaskStatusList
    {
        public int GlobalCodeId { get; set; }
        public string CodeName { get; set; }
    }

    public class UsersList
    {
        public int UserId { get; set; }
        public string UserName { get; set; }

    }

}
