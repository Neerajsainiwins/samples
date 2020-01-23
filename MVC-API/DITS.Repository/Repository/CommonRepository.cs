using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DITS.Entities.Request;
using DITS.Entities.Response;
using DITS.Repository.IRepository;

namespace DITS.Repository.Repository
{
    public class CommonRepository : ICommonRepository
    {
        #region Private
        BaseResponse baseResponse = null;
        LoginResponse loginResponse = null;
        SaveEducationResponse saveEducationResponse = null;
        SaveEmergencyContactResponse saveEmergencyContactResponse = null;
        SaveWorkDetailResponse saveWorkDetailResponse = null;
        SaveBasicDetailResponse saveBasicDetailResponse = null;
        SaveUserDetailResponse saveUserDetailResponse = null;
        GetDropdownResponse getDropdownResponse = null;
        #endregion

        public async Task<LoginResponse> Login(LoginRequest LoginRequest)
        {
            var loginResponse = new LoginResponse();
            try
            {

                using (DITSPortalEntities db = new DITSPortalEntities())
                {
                    var result = (from s in db.UserLoginDetails
                                  where s.UserName == LoginRequest.UserName && s.Password == LoginRequest.Password
                                  select s).FirstOrDefault();
                    if (result != null)
                    {
                        loginResponse.Name = result.UserName + " " + result.Password;
                        loginResponse.UserBasicInformationId = result.UserBasicInformationId;
                        loginResponse.UserLoginId = result.UserId;
                        loginResponse.Email = result.Email;
                        loginResponse.Success = true;
                        loginResponse.Message = "Login successfully";
                    }
                    else
                    {
                        loginResponse.Success = false;
                        loginResponse.Message = "Please enter valid user name and password";
                    }

                }
            }
            catch (Exception ex)
            {
                loginResponse.Success = false;
                loginResponse.Message = "INTERNAL_ERROR";
            }
            return loginResponse;
        }

        public async Task<BaseResponse> SignUpUser(SignUpRequest signUpRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (DITSPortalEntities db = new DITSPortalEntities())
                {
                    UserBasicDetail basicDetail = new UserBasicDetail();
                    basicDetail.FirstName = signUpRequest.FirstName;
                    basicDetail.LastName = signUpRequest.LastName;
                    basicDetail.Gender = signUpRequest.Gender;
                    basicDetail.DateofBirth = signUpRequest.DateOfBirth;
                    db.UserBasicDetails.Add(basicDetail);
                    //await db.SaveChangesAsync();
                    db.SaveChanges();

                    UserLoginDetail loginDetail = new UserLoginDetail();
                    loginDetail.Email = signUpRequest.Email;
                    loginDetail.Password = signUpRequest.LastName;
                    loginDetail.UserName = signUpRequest.FirstName;
                    loginDetail.UserBasicInformationId = basicDetail.UserBasicInformationId;
                    db.UserLoginDetails.Add(loginDetail);

                    db.SaveChanges();

                    baseResponse.Success = true;
                    baseResponse.Message = "User saved successfully";
                }
            }
            catch (Exception ex)
            {
                baseResponse.Success = false;
                baseResponse.Message = "INTERNAL_ERROR";
            }
            return baseResponse;
        }

        public async Task<BaseResponse> addEducationDetail(EducationDetail educationDetail)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (DITSPortalEntities db = new DITSPortalEntities())
                {
                    if (educationDetail.EducationDetailId > 0)
                    {
                        UserEducationDetail userEducationDetail = new UserEducationDetail();
                        userEducationDetail = db.UserEducationDetails.Find(educationDetail.EducationDetailId);
                        userEducationDetail.Course = educationDetail.Course;
                        userEducationDetail.CurrentlyStudying = educationDetail.CurrentlyStudying;
                        userEducationDetail.InstituteName = educationDetail.InstituteName;
                        userEducationDetail.PassoutYear = educationDetail.PassoutYear;
                        userEducationDetail.Percentage = educationDetail.Percentage;
                        userEducationDetail.QualificationType = educationDetail.QualificationType;
                        await db.SaveChangesAsync();
                        baseResponse.Success = true;
                        baseResponse.Message = "Education detail updated successfully";
                    }
                    else
                    {

                        UserEducationDetail userEducationDetail = new UserEducationDetail();
                        userEducationDetail.Course = educationDetail.Course;
                        userEducationDetail.CurrentlyStudying = educationDetail.CurrentlyStudying;
                        userEducationDetail.InstituteName = educationDetail.InstituteName;
                        userEducationDetail.PassoutYear = educationDetail.PassoutYear;
                        userEducationDetail.Percentage = educationDetail.Percentage;
                        userEducationDetail.QualificationType = educationDetail.QualificationType;
                        userEducationDetail.UserBasicInformationId = educationDetail.UserBasicInformationId;
                        db.UserEducationDetails.Add(userEducationDetail);
                        await db.SaveChangesAsync();

                        baseResponse.Success = true;
                        baseResponse.Message = "Education detail added successfully";
                    }
                }
            }
            catch (Exception ex)
            {
                baseResponse.Success = false;
                baseResponse.Message = "INTERNAL_ERROR";
            }
            return baseResponse;
        }

        public List<EducationDetail> getEducationDetails(int UserBasicInformationId)
        {
            List<EducationDetail> educationDetailListResponse = new List<EducationDetail>();
            try
            {
                using (DITSPortalEntities db = new DITSPortalEntities())
                {
                    educationDetailListResponse = (from s in db.UserEducationDetails
                                  where s.UserBasicInformationId == UserBasicInformationId
                                  select new EducationDetail
                                  {
                                      Course = s.Course,
                                      UserBasicInformationId = s.UserBasicInformationId,
                                      CurrentlyStudying = s.CurrentlyStudying,
                                      EducationDetailId = s.UserEducationDetailId,
                                      InstituteName = s.InstituteName,
                                      PassoutYear = s.PassoutYear,
                                      Percentage = s.Percentage,
                                      QualificationType = s.QualificationType,
                                  }).ToList();
                }
            }
            catch (Exception ex)
            {
            }
            return educationDetailListResponse;
        }

        public async Task<BaseResponse> DeleteEducation(int educationDetailId)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (DITSPortalEntities db = new DITSPortalEntities())
                {
                    UserEducationDetail userEducationDetail = (from c in db.UserEducationDetails
                                                               where c.UserEducationDetailId == educationDetailId
                                                               select c).FirstOrDefault();

                    db.UserEducationDetails.Remove(userEducationDetail);
                    db.SaveChanges();


                    baseResponse.Success = true;
                    baseResponse.Message = "Deleted successfully";
                }
            }
            catch (Exception ex)
            {
                baseResponse.Success = false;
                baseResponse.Message = "INTERNAL_ERROR";
            }
            return baseResponse;
        }

        public async Task<SaveEmergencyContactResponse> AddEmergencyContacts(EmergencyContactRequest emergencyContactRequest)
        {
            try
            {
                saveEmergencyContactResponse = new SaveEmergencyContactResponse();
                using (DITSPortalEntities db = new DITSPortalEntities())
                {

                    if (emergencyContactRequest.UserEmergencyContactId > 0)
                    {
                        UserEmergencyContact userEmergencyContact = new UserEmergencyContact();
                        userEmergencyContact = db.UserEmergencyContacts.Find(emergencyContactRequest.UserEmergencyContactId);
                        userEmergencyContact.Name = emergencyContactRequest.Name;
                        userEmergencyContact.Occupation = emergencyContactRequest.Occupation;
                        userEmergencyContact.Relation = emergencyContactRequest.Relation;
                        userEmergencyContact.ContactNumber = emergencyContactRequest.ContactNumber;
                        await db.SaveChangesAsync();
                        saveEmergencyContactResponse.Success = true;
                        saveEmergencyContactResponse.Message = "Emergency Contact updated successfully";
                    }

                    else
                    {

                        UserEmergencyContact userEmergencyContact = new UserEmergencyContact();
                        userEmergencyContact.Name = emergencyContactRequest.Name;
                        userEmergencyContact.Occupation = emergencyContactRequest.Occupation;
                        userEmergencyContact.Relation = emergencyContactRequest.Relation;
                        userEmergencyContact.ContactNumber = emergencyContactRequest.ContactNumber;
                        userEmergencyContact.UserBasicInformationId = emergencyContactRequest.UserBasicInformationId;
                        db.UserEmergencyContacts.Add(userEmergencyContact);
                        await db.SaveChangesAsync();

                        GetEmergencyContactResponse emergencyContactResponse = new GetEmergencyContactResponse();
                        emergencyContactResponse.Name = userEmergencyContact.Name;
                        emergencyContactResponse.Occupation = userEmergencyContact.Occupation;
                        emergencyContactResponse.Relation = userEmergencyContact.Relation;
                        emergencyContactResponse.ContactNumber = userEmergencyContact.ContactNumber;
                        emergencyContactResponse.UserEmergencyContactId = userEmergencyContact.UserEmengencyContact;

                        saveEmergencyContactResponse.GetEmergencyContactResponse = emergencyContactResponse;
                        saveEmergencyContactResponse.Success = true;
                        saveEmergencyContactResponse.Message = "Emergency Contact saved successfully";
                    }


                }
            }
            catch (Exception ex)
            {
                baseResponse.Success = false;
                baseResponse.Message = "INTERNAL_ERROR";
            }
            return saveEmergencyContactResponse;
        }

        public async Task<BaseResponse> DeleteEmergencyContact(DeleteEmergencyContact deleteEmergencyContact)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (DITSPortalEntities db = new DITSPortalEntities())
                {
                    UserEmergencyContact userEmergencyContact = (from c in db.UserEmergencyContacts
                                                                 where c.UserEmengencyContact == deleteEmergencyContact.UserEmergencyContactId
                                                                 select c).FirstOrDefault();

                    db.UserEmergencyContacts.Remove(userEmergencyContact);
                    db.SaveChanges();


                    baseResponse.Success = true;
                    baseResponse.Message = "Deleted successfully";
                }
            }
            catch (Exception ex)
            {
                baseResponse.Success = false;
                baseResponse.Message = "INTERNAL_ERROR";
            }
            return baseResponse;
        }

        public List<EmergencyContactRequest> GetAllEmergencyContacts(EducationDetail getEducationRequest)
        {
            List<EmergencyContactRequest> emergencyContactDetailListResponse = new List<EmergencyContactRequest>();
            try
            {

                using (DITSPortalEntities db = new DITSPortalEntities())
                {
                    emergencyContactDetailListResponse = (from s in db.UserEmergencyContacts
                                                          where s.UserBasicInformationId == getEducationRequest.UserBasicInformationId
                                                          select new EmergencyContactRequest
                                                          {
                                                              Name = s.Name,
                                                              UserBasicInformationId = s.UserBasicInformationId,
                                                              Relation = s.Relation,
                                                              Occupation = s.Occupation,
                                                              ContactNumber = s.ContactNumber,
                                                              UserEmergencyContactId = s.UserEmengencyContact,
                                                          }).ToList();


                }
            }
            catch (Exception ex)
            {
            }
            return emergencyContactDetailListResponse;
        }

        public async Task<SaveWorkDetailResponse> AddWorkDetails(WorkDetailRequest workDetailRequest)
        {
            try
            {
                saveWorkDetailResponse = new SaveWorkDetailResponse();
                using (DITSPortalEntities db = new DITSPortalEntities())
                {

                    if (workDetailRequest.UserWorkDetailId > 0)
                    {
                        UserWorkDetail userWorkDetail = new UserWorkDetail();
                        userWorkDetail = await db.UserWorkDetails.Where(x => x.UserWorkDetailId == workDetailRequest.UserWorkDetailId).FirstOrDefaultAsync();
                        userWorkDetail.OrganizationType = workDetailRequest.OrganizationType;
                        userWorkDetail.OrganizationName = workDetailRequest.OrganisationName;
                        userWorkDetail.Designation = workDetailRequest.Designation;
                        userWorkDetail.StartMonth = workDetailRequest.StartMonth;
                        userWorkDetail.EndMonth = workDetailRequest.EndMonth;
                        userWorkDetail.StartYear = workDetailRequest.StartYear;
                        userWorkDetail.EndYear = workDetailRequest.EndYear;
                        await db.SaveChangesAsync();
                        saveWorkDetailResponse.Success = true;
                        saveWorkDetailResponse.Message = "Work Details updated successfully";
                    }

                    else
                    {

                        UserWorkDetail userWorkDetail = new UserWorkDetail();
                        userWorkDetail.OrganizationType = workDetailRequest.OrganizationType;
                        userWorkDetail.OrganizationName = workDetailRequest.OrganisationName;
                        userWorkDetail.Designation = workDetailRequest.Designation;
                        userWorkDetail.StartMonth = workDetailRequest.StartMonth;
                        userWorkDetail.EndMonth = workDetailRequest.EndMonth;
                        userWorkDetail.StartYear = workDetailRequest.StartYear;
                        userWorkDetail.EndYear = workDetailRequest.EndYear;
                        userWorkDetail.UserBasicInformationId = workDetailRequest.UserBasicInformationId;
                        db.UserWorkDetails.Add(userWorkDetail);
                        await db.SaveChangesAsync();

                        GetWorkDetailResponse workDetailResponse = new GetWorkDetailResponse();
                        workDetailResponse.OrganizationType = userWorkDetail.OrganizationType;
                        workDetailResponse.OrganisationName = userWorkDetail.OrganizationName;
                        workDetailResponse.Designation = userWorkDetail.Designation;
                        workDetailResponse.StartMonth = userWorkDetail.StartMonth;
                        workDetailResponse.EndMonth = userWorkDetail.EndMonth;
                        workDetailResponse.StartYear = userWorkDetail.StartYear;
                        workDetailResponse.EndYear = userWorkDetail.EndYear;
                        workDetailResponse.UserWorkDetailId = userWorkDetail.UserWorkDetailId;
                        workDetailResponse.UserBasicInformationId = userWorkDetail.UserBasicInformationId;

                        saveWorkDetailResponse.GetWorkDetailResponse = workDetailResponse;
                        saveWorkDetailResponse.Success = true;
                        saveWorkDetailResponse.Message = "Work Details saved successfully";
                    }


                }
            }
            catch (Exception ex)
            {
                baseResponse.Success = false;
                baseResponse.Message = "INTERNAL_ERROR";
            }
            return saveWorkDetailResponse;
        }

        public async Task<BaseResponse> DeleteWorkDetail(DeleteWork deleteWork)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (DITSPortalEntities db = new DITSPortalEntities())
                {
                    UserWorkDetail userWorkDetail = (from c in db.UserWorkDetails
                                                     where c.UserWorkDetailId == deleteWork.UserWorkDetailId
                                                     select c).FirstOrDefault();

                    db.UserWorkDetails.Remove(userWorkDetail);
                    db.SaveChanges();


                    baseResponse.Success = true;
                    baseResponse.Message = "Deleted successfully";
                }
            }
            catch (Exception ex)
            {
                baseResponse.Success = false;
                baseResponse.Message = "INTERNAL_ERROR";
            }
            return baseResponse;
        }

        public List<WorkDetailRequest> GetWorkDetails(WorkDetailRequest getEducationRequest)
        {
            List<WorkDetailRequest> WorkDetailListResponse = new List<WorkDetailRequest>();
            try
            {

                using (DITSPortalEntities db = new DITSPortalEntities())
                {
                    WorkDetailListResponse = (from s in db.UserWorkDetails
                                              where s.UserBasicInformationId == getEducationRequest.UserBasicInformationId
                                              select new WorkDetailRequest
                                              {
                                                  OrganizationType = s.OrganizationType,
                                                  OrganisationName = s.OrganizationName,
                                                  Designation = s.Designation,
                                                  StartMonth = s.StartMonth,
                                                  EndMonth = s.EndMonth,
                                                  StartYear = s.StartYear,
                                                  EndYear = s.EndYear,
                                                  UserWorkDetailId = s.UserWorkDetailId,
                                              }).ToList();


                }
            }
            catch (Exception ex)
            {
            }
            return WorkDetailListResponse;
        }

        public async Task<SaveBasicDetailResponse> AddBasicDetails(BasicInformationRequest basicInformationRequest)
        {
            try
            {
                saveBasicDetailResponse = new SaveBasicDetailResponse();
                using (DITSPortalEntities db = new DITSPortalEntities())
                {

                    if (basicInformationRequest.UserBasicInformationId > 0)
                    {
                        UserBasicDetail userBasicDetail = new UserBasicDetail();
                        userBasicDetail = await db.UserBasicDetails.Where(x => x.UserBasicInformationId == basicInformationRequest.UserBasicInformationId).FirstOrDefaultAsync();
                        userBasicDetail.FirstName = basicInformationRequest.FirstName;
                        userBasicDetail.MiddleName = basicInformationRequest.MiddleName;
                        userBasicDetail.LastName = basicInformationRequest.LastName;
                        userBasicDetail.FatherName = basicInformationRequest.FatherName;
                        userBasicDetail.MotherName = basicInformationRequest.MotherName;
                        userBasicDetail.Gender = basicInformationRequest.Gender;
                        userBasicDetail.DateofBirth = Convert.ToDateTime(basicInformationRequest.DateOfBirth);
                        userBasicDetail.BloodGroup = basicInformationRequest.BloodGroup;
                        userBasicDetail.MaritalStatus = basicInformationRequest.MaritalStatus;
                        userBasicDetail.Anniversarydate = Convert.ToDateTime(basicInformationRequest.Anniversarydate);
                        userBasicDetail.DateofJoining = Convert.ToDateTime(basicInformationRequest.DateOfJoining);
                        userBasicDetail.Hobbies = basicInformationRequest.Hobbies;
                        userBasicDetail.Nationality = basicInformationRequest.Nationality;
                        userBasicDetail.Religion = basicInformationRequest.Religion;
                        await db.SaveChangesAsync();
                        saveBasicDetailResponse.Success = true;
                        saveBasicDetailResponse.Message = "Basic Details updated successfully";

                        BasicDetailResponse basicDetailResponse = new BasicDetailResponse();
                        basicDetailResponse.FirstName = basicInformationRequest.FirstName;
                        basicDetailResponse.MiddleName = basicInformationRequest.MiddleName;
                        basicDetailResponse.LastName = basicInformationRequest.LastName;
                        basicDetailResponse.FatherName = basicInformationRequest.FatherName;
                        basicDetailResponse.MotherName = basicInformationRequest.MotherName;
                        basicDetailResponse.Gender = basicInformationRequest.Gender;
                        basicDetailResponse.DateOfBirth = basicInformationRequest.DateOfBirth;
                        basicDetailResponse.BloodGroup = basicInformationRequest.BloodGroup;
                        basicDetailResponse.MaritalStatus = basicInformationRequest.MaritalStatus;
                        basicDetailResponse.Anniversarydate = basicInformationRequest.Anniversarydate;
                        basicDetailResponse.DateOfJoining = basicInformationRequest.DateOfJoining;
                        basicDetailResponse.Hobbies = basicInformationRequest.Hobbies;
                        basicDetailResponse.Nationality = basicInformationRequest.Nationality;
                        basicDetailResponse.Religion = basicInformationRequest.Religion;
                        saveBasicDetailResponse.BasicDetailResponse = basicDetailResponse;
                    }


                }
            }
            catch (Exception ex)
            {
                baseResponse.Success = false;
                baseResponse.Message = "INTERNAL_ERROR";
            }
            return saveBasicDetailResponse;
        }

        public List<BasicInformationRequest> GetBasicDetails(BasicInformationRequest getEducationRequest)
        {
            List<BasicInformationRequest> basicDetailListResponse = new List<BasicInformationRequest>();
            try
            {

                using (DITSPortalEntities db = new DITSPortalEntities())
                {
                    basicDetailListResponse = (from s in db.UserBasicDetails
                                                   where s.UserBasicInformationId == getEducationRequest.UserBasicInformationId
                                                   select new BasicInformationRequest
                                                   {
                                                       FirstName = s.FirstName,
                                                       UserBasicInformationId = s.UserBasicInformationId,
                                                       MiddleName = s.MiddleName,
                                                       LastName = s.LastName,
                                                       FatherName = s.FatherName,
                                                       MotherName = s.MotherName,
                                                       Gender = s.Gender,
                                                       DateOfBirth = s.DateofBirth.ToString(),
                                                       BloodGroup = s.BloodGroup,
                                                       MaritalStatus = s.MaritalStatus,
                                                       Anniversarydate = s.Anniversarydate.ToString(),
                                                       DateOfJoining = s.DateofJoining.ToString(),
                                                       Hobbies = s.Hobbies,
                                                       Nationality = s.Nationality,
                                                       Religion = s.Religion,
                                                   }).ToList();


                }
            }
            catch (Exception ex)
            {
            }
            return basicDetailListResponse;
        }

        public async Task<SaveUserDetailResponse> AddUserDetails(UserDetailsRequest userDetailsRequest)
        {
            try
            {
                saveUserDetailResponse = new SaveUserDetailResponse();
                using (DITSPortalEntities db = new DITSPortalEntities())
                {

                    if (userDetailsRequest.UserContactId > 0)
                    {
                        UserContactDetail userContactDetail = new UserContactDetail();
                        userContactDetail = await db.UserContactDetails.Where(x => x.UserBasicInformationId == userDetailsRequest.UserBasicInformationId).FirstOrDefaultAsync();
                        userContactDetail.Email = userDetailsRequest.Email;
                        userContactDetail.AlternateEmail = userDetailsRequest.AlternateEmail;
                        userContactDetail.PhoneNumber = userDetailsRequest.PhoneNumber;
                        userContactDetail.AlternatePhoneNumber = userDetailsRequest.AlternatePhoneNumber;
                        userContactDetail.SkypeId = userDetailsRequest.SkypeId;
                        userContactDetail.PermanentAddress = userDetailsRequest.PermanentAddress;
                        userContactDetail.PermanentCity = userDetailsRequest.PermanentCity;
                        userContactDetail.PermanentState = userDetailsRequest.PermanentState;
                        userContactDetail.PermanentCountry = userDetailsRequest.PermanentCountry;
                        userContactDetail.PermanentZIP = userDetailsRequest.PermanentZIP;
                        userContactDetail.CorrespondenceAddress = userDetailsRequest.CorrespondenceAddress;
                        userContactDetail.CorrespondenceCity = userDetailsRequest.CorrespondenceCity;
                        userContactDetail.CorrespondenceState = userDetailsRequest.CorrespondenceState;
                        userContactDetail.CorrespondenceZIP = userDetailsRequest.CorrespondenceZIP;
                        userContactDetail.CorrespondenceCountry = userDetailsRequest.CorrespondenceCountry;
                        await db.SaveChangesAsync();
                        saveUserDetailResponse.Success = true;
                        saveUserDetailResponse.Message = "Contact Details updated successfully";

                        UserDetailResponse userDetailResponse = new UserDetailResponse();
                        userDetailResponse.Email = userDetailsRequest.Email;
                        userDetailResponse.AlternateEmail = userDetailsRequest.AlternateEmail;
                        userDetailResponse.PhoneNumber = userDetailsRequest.PhoneNumber;
                        userDetailResponse.AlternatePhoneNumber = userDetailsRequest.AlternatePhoneNumber;
                        userDetailResponse.SkypeId = userDetailsRequest.SkypeId;
                        userDetailResponse.PermanentAddress = userDetailsRequest.PermanentAddress;
                        userDetailResponse.PermanentCity = userDetailsRequest.PermanentCity;
                        userDetailResponse.PermanentState = userDetailsRequest.PermanentState;
                        userDetailResponse.PermanentCountry = userDetailsRequest.PermanentCountry;
                        userDetailResponse.PermanentZIP = userDetailsRequest.PermanentZIP;
                        userDetailResponse.CorrespondenceAddress = userDetailsRequest.CorrespondenceAddress;
                        userDetailResponse.CorrespondenceCity = userDetailsRequest.CorrespondenceCity;
                        userDetailResponse.CorrespondenceState = userDetailsRequest.CorrespondenceState;
                        userDetailResponse.CorrespondenceZIP = userDetailsRequest.CorrespondenceZIP;
                        userDetailResponse.UserContactId = userDetailsRequest.UserContactId;


                        saveUserDetailResponse.UserDetailResponse = userDetailResponse;
                    }
                    else {

                        UserContactDetail userContactDetail = new UserContactDetail();
                        userContactDetail.UserBasicInformationId = userDetailsRequest.UserBasicInformationId;
                        userContactDetail.Email = userDetailsRequest.Email;
                        userContactDetail.AlternateEmail = userDetailsRequest.AlternateEmail;
                        userContactDetail.PhoneNumber = userDetailsRequest.PhoneNumber;
                        userContactDetail.AlternatePhoneNumber = userDetailsRequest.AlternatePhoneNumber;
                        userContactDetail.SkypeId = userDetailsRequest.SkypeId;
                        userContactDetail.PermanentAddress = userDetailsRequest.PermanentAddress;
                        userContactDetail.PermanentCity = userDetailsRequest.PermanentCity;
                        userContactDetail.PermanentState = userDetailsRequest.PermanentState;
                        userContactDetail.PermanentCountry = userDetailsRequest.PermanentCountry;
                        userContactDetail.PermanentZIP = userDetailsRequest.PermanentZIP;
                        userContactDetail.CorrespondenceAddress = userDetailsRequest.CorrespondenceAddress;
                        userContactDetail.CorrespondenceCity = userDetailsRequest.CorrespondenceCity;
                        userContactDetail.CorrespondenceState = userDetailsRequest.CorrespondenceState;
                        userContactDetail.CorrespondenceZIP = userDetailsRequest.CorrespondenceZIP;
                        userContactDetail.CorrespondenceCountry = userDetailsRequest.CorrespondenceCountry;
                        db.UserContactDetails.Add(userContactDetail);
                        await db.SaveChangesAsync();
                        saveUserDetailResponse.Success = true;
                        saveUserDetailResponse.Message = "Contact Details submited successfully";

                        UserDetailResponse userDetailResponse = new UserDetailResponse();
                        userDetailResponse.Email = userDetailsRequest.Email;
                        userDetailResponse.AlternateEmail = userDetailsRequest.AlternateEmail;
                        userDetailResponse.PhoneNumber = userDetailsRequest.PhoneNumber;
                        userDetailResponse.AlternatePhoneNumber = userDetailsRequest.AlternatePhoneNumber;
                        userDetailResponse.SkypeId = userDetailsRequest.SkypeId;
                        userDetailResponse.PermanentAddress = userDetailsRequest.PermanentAddress;
                        userDetailResponse.PermanentCity = userDetailsRequest.PermanentCity;
                        userDetailResponse.PermanentState = userDetailsRequest.PermanentState;
                        userDetailResponse.PermanentCountry = userDetailsRequest.PermanentCountry;
                        userDetailResponse.PermanentZIP = userDetailsRequest.PermanentZIP;
                        userDetailResponse.CorrespondenceAddress = userDetailsRequest.CorrespondenceAddress;
                        userDetailResponse.CorrespondenceCity = userDetailsRequest.CorrespondenceCity;
                        userDetailResponse.CorrespondenceState = userDetailsRequest.CorrespondenceState;
                        userDetailResponse.CorrespondenceZIP = userDetailsRequest.CorrespondenceZIP;
                        userDetailResponse.UserContactId = userDetailsRequest.UserContactId;

                        saveUserDetailResponse.UserDetailResponse = userDetailResponse;
                    }


                }
            }
            catch (Exception ex)
            {
                baseResponse.Success = false;
                baseResponse.Message = "INTERNAL_ERROR";
            }
            return saveUserDetailResponse;
        }

        public List<UserDetailsRequest> GetUserDetails(UserDetailsRequest getEducationRequest)
        {
            List<UserDetailsRequest> userResponse = new List<UserDetailsRequest>();
            try
            {

                using (DITSPortalEntities db = new DITSPortalEntities())
                {
                    userResponse = (from s in db.UserContactDetails
                                    where s.UserBasicInformationId == getEducationRequest.UserBasicInformationId
                                    select new UserDetailsRequest
                                    {
                                        Email = s.Email,
                                        UserBasicInformationId = s.UserBasicInformationId,
                                        AlternateEmail = s.AlternateEmail,
                                        PhoneNumber = s.PhoneNumber,
                                        AlternatePhoneNumber = s.AlternatePhoneNumber,
                                        SkypeId = s.SkypeId,
                                        PermanentAddress = s.PermanentAddress,
                                        PermanentCity = s.PermanentCity,
                                        PermanentState = s.PermanentState,
                                        PermanentCountry = s.PermanentCountry,
                                        PermanentZIP = s.PermanentZIP,
                                        CorrespondenceAddress = s.CorrespondenceAddress,
                                        CorrespondenceCity = s.CorrespondenceCity,
                                        CorrespondenceState = s.CorrespondenceState,
                                        CorrespondenceCountry = s.CorrespondenceCountry,
                                        CorrespondenceZIP = s.CorrespondenceZIP,
                                        UserContactId = s.UserContactId
                                    }).ToList();


                }
            }
            catch (Exception ex)
            {
            }
            return userResponse;
        }

        public async Task<GetDropdownResponse> FillDropdowns()
        {
            getDropdownResponse = new GetDropdownResponse();
            try
            {

                using (DITSPortalEntities db = new DITSPortalEntities())
                {
                    getDropdownResponse.GenderList = (from gc in db.GlobalCodes
                                                      join gcc in db.GlobalCodeCategories
                                                      on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                      where gcc.CategoryName == "Gender"
                                                      select new GenderList
                                                      {
                                                          CodeName = gc.CodeName,
                                                          GlobalCodeId = gc.GlobalCodeId
                                                      }).ToList();

                    getDropdownResponse.MaritalStatusList = (from gc in db.GlobalCodes
                                                             join gcc in db.GlobalCodeCategories
                                                             on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                             where gcc.CategoryName == "MaritalStatus"
                                                             select new MaritalStatusList
                                                             {
                                                                 CodeName = gc.CodeName,
                                                                 GlobalCodeId = gc.GlobalCodeId
                                                             }).ToList();

                    getDropdownResponse.BloodGroupList = (from gc in db.GlobalCodes
                                                          join gcc in db.GlobalCodeCategories
                                                          on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                          where gcc.CategoryName == "BloodGroup"
                                                          select new BloodGroupList
                                                          {
                                                              CodeName = gc.CodeName,
                                                              GlobalCodeId = gc.GlobalCodeId
                                                          }).ToList();

                    getDropdownResponse.NationalityList = (from gc in db.GlobalCodes
                                                           join gcc in db.GlobalCodeCategories
                                                           on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                           where gcc.CategoryName == "Nationality"
                                                           select new NationalityList
                                                           {
                                                               CodeName = gc.CodeName,
                                                               GlobalCodeId = gc.GlobalCodeId
                                                           }).ToList();

                    getDropdownResponse.ReligionList = (from gc in db.GlobalCodes
                                                        join gcc in db.GlobalCodeCategories
                                                        on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                        where gcc.CategoryName == "Religion"
                                                        select new ReligionList
                                                        {
                                                            CodeName = gc.CodeName,
                                                            GlobalCodeId = gc.GlobalCodeId
                                                        }).ToList();

                    getDropdownResponse.StateList = (from gc in db.GlobalCodes
                                                     join gcc in db.GlobalCodeCategories
                                                     on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                     where gcc.CategoryName == "State"
                                                     select new StateList
                                                     {
                                                         CodeName = gc.CodeName,
                                                         GlobalCodeId = gc.GlobalCodeId
                                                     }).ToList();

                    getDropdownResponse.CityList = (from gc in db.GlobalCodes
                                                    join gcc in db.GlobalCodeCategories
                                                    on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                    where gcc.CategoryName == "City"
                                                    select new CityList
                                                    {
                                                        CodeName = gc.CodeName,
                                                        GlobalCodeId = gc.GlobalCodeId
                                                    }).ToList();

                    getDropdownResponse.CountryList = (from gc in db.GlobalCodes
                                                       join gcc in db.GlobalCodeCategories
                                                       on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                       where gcc.CategoryName == "Country"
                                                       select new CountryList
                                                       {
                                                           CodeName = gc.CodeName,
                                                           GlobalCodeId = gc.GlobalCodeId
                                                       }).ToList();

                    getDropdownResponse.OccupationList = (from gc in db.GlobalCodes
                                                          join gcc in db.GlobalCodeCategories
                                                          on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                          where gcc.CategoryName == "Occupation"
                                                          select new OccupationList
                                                          {
                                                              CodeName = gc.CodeName,
                                                              GlobalCodeId = gc.GlobalCodeId
                                                          }).ToList();

                    getDropdownResponse.QualificationTypeList = (from gc in db.GlobalCodes
                                                                 join gcc in db.GlobalCodeCategories
                                                                 on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                                 where gcc.CategoryName == "QualificationType"
                                                                 select new QualificationTypeList
                                                                 {
                                                                     CodeName = gc.CodeName,
                                                                     GlobalCodeId = gc.GlobalCodeId
                                                                 }).ToList();

                    getDropdownResponse.CourseList = (from gc in db.GlobalCodes
                                                      join gcc in db.GlobalCodeCategories
                                                      on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                      where gcc.CategoryName == "Course"
                                                      select new CourseList
                                                      {
                                                          CodeName = gc.CodeName,
                                                          GlobalCodeId = gc.GlobalCodeId
                                                      }).ToList();

                    getDropdownResponse.OrganizationList = (from gc in db.GlobalCodes
                                                            join gcc in db.GlobalCodeCategories
                                                            on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                            where gcc.CategoryName == "OrganizationType"
                                                            select new OrganizationList
                                                            {
                                                                CodeName = gc.CodeName,
                                                                GlobalCodeId = gc.GlobalCodeId
                                                            }).ToList();


                    getDropdownResponse.RelationList = (from gc in db.GlobalCodes
                                                        join gcc in db.GlobalCodeCategories
                                                        on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                        where gcc.CategoryName == "Relation"
                                                        select new RelationList
                                                        {
                                                            CodeName = gc.CodeName,
                                                            GlobalCodeId = gc.GlobalCodeId
                                                        }).ToList();


                    getDropdownResponse.CategoryList = (from gc in db.GlobalCodes
                                                        join gcc in db.GlobalCodeCategories
                                                        on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                        where gcc.CategoryName == "Category"
                                                        select new CategoryList
                                                        {
                                                            CodeName = gc.CodeName,
                                                            GlobalCodeId = gc.GlobalCodeId
                                                        }).ToList();

                    getDropdownResponse.PriorityList = (from gc in db.GlobalCodes
                                                        join gcc in db.GlobalCodeCategories
                                                        on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                        where gcc.CategoryName == "Priority"
                                                        select new PriorityList
                                                        {
                                                            CodeName = gc.CodeName,
                                                            GlobalCodeId = gc.GlobalCodeId
                                                        }).ToList();


                    getDropdownResponse.TaskStatusList = (from gc in db.GlobalCodes
                                                          join gcc in db.GlobalCodeCategories
                                                          on gc.GlobalCodeCategoryId equals gcc.GlobalCodeCategoryId
                                                          where gcc.CategoryName == "TaskStatus"
                                                          select new TaskStatusList
                                                          {
                                                              CodeName = gc.CodeName,
                                                              GlobalCodeId = gc.GlobalCodeId
                                                          }).ToList();

                    getDropdownResponse.UsersList = (db.Users.Select(x => new UsersList
                    {
                        UserId = x.UserId,
                        UserName = x.UserName
                    })).ToList();
                }
            }
            catch (Exception ex)
            {
            }
            return getDropdownResponse;
        }

        public async Task<BaseResponse> CreateTask(TaskRequest taskRequest, List<string> list)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (DITSPortalEntities db = new DITSPortalEntities())
                {

                    if (taskRequest.TaskId > 0)
                    {
                        UserBasicDetail userBasicDetail = new UserBasicDetail();
                        //userBasicDetail = await db.UserBasicDetails.Where(x => x.UserBasicInformationId == basicInformationRequest.UserBasicInformationId).FirstOrDefaultAsync();
                        //userBasicDetail.FirstName = basicInformationRequest.FirstName;
                        //userBasicDetail.MiddleName = basicInformationRequest.MiddleName;
                        //userBasicDetail.LastName = basicInformationRequest.LastName;
                        //userBasicDetail.FatherName = basicInformationRequest.FatherName;
                        //userBasicDetail.MotherName = basicInformationRequest.MotherName;
                        //userBasicDetail.Gender = basicInformationRequest.Gender;
                        //userBasicDetail.DateofBirth = Convert.ToDateTime(basicInformationRequest.DateOfBirth);
                        //userBasicDetail.BloodGroup = basicInformationRequest.BloodGroup;
                        //userBasicDetail.MaritalStatus = basicInformationRequest.MaritalStatus;
                        //userBasicDetail.Anniversarydate = Convert.ToDateTime(basicInformationRequest.Anniversarydate);
                        //userBasicDetail.DateofJoining = Convert.ToDateTime(basicInformationRequest.DateOfJoining);
                        //userBasicDetail.Hobbies = basicInformationRequest.Hobbies;
                        //userBasicDetail.Nationality = basicInformationRequest.Nationality;
                        //userBasicDetail.Religion = basicInformationRequest.Religion;
                        //await db.SaveChangesAsync();
                        //saveBasicDetailResponse.Success = true;
                        //saveBasicDetailResponse.Message = "Basic Details updated successfully";

                        //BasicDetailResponse basicDetailResponse = new BasicDetailResponse();
                        //basicDetailResponse.FirstName = basicInformationRequest.FirstName;
                        //basicDetailResponse.MiddleName = basicInformationRequest.MiddleName;
                        //basicDetailResponse.LastName = basicInformationRequest.LastName;
                        //basicDetailResponse.FatherName = basicInformationRequest.FatherName;
                        //basicDetailResponse.MotherName = basicInformationRequest.MotherName;
                        //basicDetailResponse.Gender = basicInformationRequest.Gender;
                        //basicDetailResponse.DateOfBirth = (basicInformationRequest.DateOfBirth).ToString();
                        //basicDetailResponse.BloodGroup = basicInformationRequest.BloodGroup;
                        //basicDetailResponse.MaritalStatus = basicInformationRequest.MaritalStatus;
                        //basicDetailResponse.Anniversarydate = Convert.ToString(basicInformationRequest.Anniversarydate);
                        //basicDetailResponse.DateOfJoining = Convert.ToString(basicInformationRequest.DateOfJoining);
                        //basicDetailResponse.Hobbies = basicInformationRequest.Hobbies;
                        //basicDetailResponse.Nationality = basicInformationRequest.Nationality;
                        //basicDetailResponse.Religion = basicInformationRequest.Religion;





                        //saveBasicDetailResponse.BasicDetailResponse = basicDetailResponse;
                    }

                    else
                    {
                        Task task = new Task();
                        task.Name = taskRequest.Name;
                        task.Description = taskRequest.Description;
                        //task.ScheduleStartDateTime = taskRequest.ScheduleStartDateTime;
                        //task.ScheduleEndDateTime = taskRequest.ScheduleEndDateTime;
                        task.AssignedBy = taskRequest.AssignedBy;
                        task.Priority = taskRequest.Priority;
                        task.Status = taskRequest.Status;
                        task.PercentageComplete = taskRequest.PercentageComplete;
                        //task.StartDateTime = taskRequest.StartDateTime;
                        //task.EndDateTime = taskRequest.EndDateTime;
                        task.PredecessorTask = taskRequest.PredecessorTask;
                        task.CreatedDate = DateTime.Now;
                        task.Active = true;
                        task.RecordDeleted = false;
                        task.ModifiedDate = DateTime.Now;
                        db.Tasks.Add(task);
                        await db.SaveChangesAsync();


                        TaskAssignment taskAssignment = new TaskAssignment();
                        taskAssignment.TaskId = task.TaskId;
                        taskAssignment.UserId = 5;
                        taskAssignment.RoleType = 154;
                        taskAssignment.CreatedDate = DateTime.Now;
                        taskAssignment.ModifiedDate = DateTime.Now;
                        taskAssignment.RecordDeleted = false;
                        taskAssignment.ModifiedBy = "Admin";
                        taskAssignment.Active = true;
                        taskAssignment.CreatedBy = "Admin";
                        db.TaskAssignments.Add(taskAssignment);
                        await db.SaveChangesAsync();


                        foreach (string path in list)
                        {

                            Tb_Documents document = new Tb_Documents();
                            //document.Category =;
                            document.Type = 150;
                            document.Path = path;
                            document.UploadDatetime = DateTime.Now;
                            document.UploadedBy = 1;
                            document.Active = true;
                            document.CreatedBy = "Admin";
                            document.CreatedDate = DateTime.Now;
                            document.ModifiedBy = "Admin";
                            document.ModifiedDate = DateTime.Now;
                            document.RecordDeleted = false;
                            db.Tb_Documents.Add(document);
                            await db.SaveChangesAsync();

                        }

                        baseResponse.Success = true;
                        baseResponse.Message = "Task Added Successfully";

                    }
                }


            }
            catch (Exception ex)
            {
                baseResponse.Success = false;
                baseResponse.Message = "INTERNAL_ERROR";
            }
            return baseResponse;
        }

        public List<TaskRequest> GetAllTasks(GetEducationRequest getEducationRequest)
        {
            List<TaskRequest> taskResponse = new List<TaskRequest>();
            try
            {

                using (DITSPortalEntities db = new DITSPortalEntities())
                {
                    taskResponse = (from s in db.Tasks
                                    join gc in db.GlobalCodes on s.Priority equals gc.GlobalCodeId
                                    join ta in db.TaskAssignments on s.TaskId equals ta.TaskId
                                    select new TaskRequest
                                    {
                                        Name = s.Name,
                                        Description = s.Description,
                                        ScheduleStartDateTime = s.ScheduleStartDateTime,
                                        ScheduleEndDateTime = s.ScheduleEndDateTime,
                                        Priority = s.Priority,
                                        Status = s.Status,
                                        Prioritys = gc.CodeName,
                                        AssignedBy = s.AssignedBy,
                                        PercentageComplete = s.PercentageComplete,
                                        PredecessorTask = s.PredecessorTask,
                                        TaskId = s.TaskId,
                                        RoleType = ta.RoleType
                                    }).ToList();
                }


            }

            catch (Exception ex)
            {
            }
            return taskResponse;
        }
    }
}
