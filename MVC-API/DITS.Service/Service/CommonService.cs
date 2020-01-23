using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DITS.Entities.Request;
using DITS.Entities.Response;
using DITS.Repository.IRepository;
using DITS.Service.IService;

namespace DITS.Service.Service
{
   public class CommonService: ICommonService
    {
        private ICommonRepository _ICommonRepository;

        public CommonService(ICommonRepository ICommonRepository)
        {
            _ICommonRepository = ICommonRepository;
        }

        public async Task<LoginResponse> Login(LoginRequest loginRequest)
        {
            return await _ICommonRepository.Login(loginRequest);
        }

        public async Task<BaseResponse> SignUpUser(SignUpRequest signUpRequest)
        {
            return await _ICommonRepository.SignUpUser(signUpRequest);
        }

        public async Task<BaseResponse> addEducationDetail(EducationDetail educationDetail)
        {
            return await _ICommonRepository.addEducationDetail(educationDetail);
        }

        public List<EducationDetail> getEducationDetails(int UserBasicInformationId)
        {
            return _ICommonRepository.getEducationDetails(UserBasicInformationId);
        }

        public async Task<BaseResponse> DeleteEducation(int deleteEducation)
        {
            return await _ICommonRepository.DeleteEducation(deleteEducation);
        }

        public async Task<SaveEmergencyContactResponse> AddEmergencyContacts(EmergencyContactRequest emergencyContactRequest)
        {
            return await _ICommonRepository.AddEmergencyContacts(emergencyContactRequest);

        }

        public List<EmergencyContactRequest> GetAllEmergencyContacts(EducationDetail getEducationRequest)
        {
            return _ICommonRepository.GetAllEmergencyContacts(getEducationRequest);

        }

        public async Task<BaseResponse> DeleteEmergencyContact(DeleteEmergencyContact deleteEmergencyContact)
        {
            return await _ICommonRepository.DeleteEmergencyContact(deleteEmergencyContact);
        }

        public async Task<SaveWorkDetailResponse> AddWorkDetails(WorkDetailRequest workDetailRequest)
        {
            return await _ICommonRepository.AddWorkDetails(workDetailRequest);
        }

        public async Task<BaseResponse> DeleteWorkDetail(DeleteWork deleteWork)
        {
            return await _ICommonRepository.DeleteWorkDetail(deleteWork);
        }

        public List<WorkDetailRequest> GetWorkDetails(WorkDetailRequest getEducationRequest)
        {
            return _ICommonRepository.GetWorkDetails(getEducationRequest);
        }

        public List<BasicInformationRequest> GetBasicDetails(BasicInformationRequest getEducationRequest)
        {
            return _ICommonRepository.GetBasicDetails(getEducationRequest);
        }

        public Task<SaveBasicDetailResponse> AddBasicDetails(BasicInformationRequest basicInformationRequest)
        {
            return _ICommonRepository.AddBasicDetails(basicInformationRequest);
        }

        public Task<SaveUserDetailResponse> AddUserDetails(UserDetailsRequest userDetailsRequest)
        {
            return _ICommonRepository.AddUserDetails(userDetailsRequest);
        }

        public List<UserDetailsRequest> GetUserDetails(UserDetailsRequest getEducationRequest)
        {
            return _ICommonRepository.GetUserDetails(getEducationRequest);
        }

        public Task<GetDropdownResponse> FillDropdowns()
        {
            return _ICommonRepository.FillDropdowns();
        }

        public async Task<BaseResponse> CreateTask(TaskRequest taskRequest, List<string> list)
        {
            return await _ICommonRepository.CreateTask(taskRequest, list);
        }
        public List<TaskRequest> GetAllTasks(GetEducationRequest getEducationRequest)
        {
            return _ICommonRepository.GetAllTasks(getEducationRequest);
        }

    }
}
