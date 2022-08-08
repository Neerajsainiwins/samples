using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DITS.Repository.IRepository;
using DITS.Service.IService;
using DITS.Entities.Request;
using DITS.Entities.Response;

namespace DITS.Service.IService
{
  public  interface ICommonService
    {

        Task<BaseResponse> SignUpUser(SignUpRequest signUpRequest);
        Task<LoginResponse> Login(LoginRequest loginRequest);
        Task<BaseResponse> addEducationDetail(EducationDetail educationDetail);
        List<EducationDetail> getEducationDetails(int UserBasicInformationId);
        Task<BaseResponse> DeleteEducation(int deleteEducation);
        Task<SaveEmergencyContactResponse> AddEmergencyContacts(EmergencyContactRequest emergencyContactRequest);
        List<EmergencyContactRequest> GetAllEmergencyContacts(EducationDetail getEducationRequest);
        Task<BaseResponse> DeleteEmergencyContact(DeleteEmergencyContact deleteEmergencyContact);
        Task<SaveWorkDetailResponse> AddWorkDetails(WorkDetailRequest workDetailRequest);
        Task<BaseResponse> DeleteWorkDetail(DeleteWork deleteWork);
        List<WorkDetailRequest> GetWorkDetails(WorkDetailRequest getWorkDetailRequest);
        List<BasicInformationRequest> GetBasicDetails(BasicInformationRequest getBasicInformationRequest);
        Task<SaveBasicDetailResponse> AddBasicDetails(BasicInformationRequest basicInformationRequest);
        Task<SaveUserDetailResponse> AddUserDetails(UserDetailsRequest userDetailsRequest);
        List<UserDetailsRequest> GetUserDetails(UserDetailsRequest getUserDetailsRequest);
        Task<GetDropdownResponse> FillDropdowns();
        Task<BaseResponse> CreateTask(TaskRequest taskRequest, List<string> list);
        List<TaskRequest> GetAllTasks(GetEducationRequest getEducationRequest);
    }
}
