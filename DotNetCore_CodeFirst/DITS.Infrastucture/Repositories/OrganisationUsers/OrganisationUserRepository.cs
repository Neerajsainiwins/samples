using DITS.Core;
using DITS.Core.DTOs.Common.Response;
using DITS.Core.DTOs.Common.Ṛesponse;
using DITS.Core.DTOs.OrganisationUsers.Request;
using DITS.Core.Interfaces.OrganisationUsers;
using DITS.Core.Organisations;
using DITS.Core.Users;
using DITS.Infrastucture.Data;
using DITS.Infrastucture.Repositories.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace DITS.Infrastucture.Repositories.OrganisationUsers
{
    public class OrganisationUserRepository : IOrganisationUserRepository
    {
        private readonly Context _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<OrganisationUserRepository> _logger;
        public OrganisationUserRepository(Context dbContext,
                                      UserManager<ApplicationUser> userManager,
                                      IConfiguration configuration,
                                      ILogger<OrganisationUserRepository> logger)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
        }


        public async Task<CommonResponse> InviteOrganisationUser(InviteUserDTO inviteUserDTO, string loggedInUserId)
        {
            try
            {
                CommonResponse response = new CommonResponse();
                ResponseModel responseModel = new ResponseModel();

                using (var transaction = _dbContext.Database.BeginTransaction())
                {
                    try
                    {
                        var userExists = await _userManager.FindByEmailAsync(inviteUserDTO.Email);
                        if (userExists != null)
                        {
                            var userRoles = await _userManager.GetRolesAsync(userExists);

                            if (userRoles.Contains("Administrator"))
                            {
                                response.Message = "Cannot set this user as an Administrator. This user is an &Wider Administrator";
                                response.Data = responseModel;
                                return response;
                            }
                            else if (userRoles.Contains("Organisation Administrator") && inviteUserDTO.IsAdministrator)
                            {
                                response.Message = "Cannot set this user as an Administrator. This user is already an Administrator in another organisation";
                                response.Data = responseModel;
                                return response;
                            }
                        }

                        if (userExists == null)
                        {
                            ApplicationUser user = new()
                            {
                                Email = inviteUserDTO.Email,
                                SecurityStamp = Guid.NewGuid().ToString(),
                                UserName = inviteUserDTO.Email,
                                IsApproved = true,
                                LastLoggedInDateUtc = DateTime.Now,
                                CreatedOn = DateTime.Now,
                                CreatedBy = loggedInUserId,
                                UpdatedOn = DateTime.Now,
                                UpdatedBy = loggedInUserId,
                            };

                            var password = "P@ssw0rd";
                            var result = await _userManager.CreateAsync(user, password);

                            if (result == null)
                            {
                                response.Message = "User creation failed! Please check user details and try again.";
                                response.Data = responseModel;
                                return response;
                            }



                        UserDetail userDetails = new()
                        {
                            FirstNames = inviteUserDTO.FirstName,
                            LastName = inviteUserDTO.LastName,
                            WorkPhoneNumber = inviteUserDTO.PhoneNumber,
                            MobilePhoneNumber = inviteUserDTO.PhoneNumber,
                            PhysicalAddress = inviteUserDTO.PhysicalAddress,
                            UserId = user.Id,
                            CreatedBy = loggedInUserId,
                            CreatedOn = DateTime.Now,
                            UpdatedBy = loggedInUserId,
                            UpdatedOn = DateTime.Now
                        };
                        await _dbContext.AddAsync(userDetails);
                        await _dbContext.SaveChangesAsync();

                            if (inviteUserDTO.IsAdministrator)
                            {
                                OrganisationUser organisationUser = new OrganisationUser();
                                organisationUser.OrganisationId = inviteUserDTO.OrganisationId;
                                organisationUser.UserId = user.Id;
                                organisationUser.CreatedBy = loggedInUserId;
                                organisationUser.CreatedOn = DateTime.Now;
                                organisationUser.UpdatedBy = loggedInUserId;
                                organisationUser.UpdatedOn = DateTime.Now;
                                await _userManager.AddToRoleAsync(user, "Organisation Administrator");
                                await _dbContext.OrganisationUsers.AddAsync(organisationUser);
                                await _dbContext.SaveChangesAsync();
                            }
                            else
                            {
                                List<OrganisationSiteUser> organisationSiteUsers = new List<OrganisationSiteUser>();
                                foreach (var organisationSiteId in inviteUserDTO.OrganisationSiteIds)
                                {
                                    OrganisationSiteUser organisationSiteUser = new OrganisationSiteUser();
                                    organisationSiteUser.UserId = user.Id;
                                    organisationSiteUser.OrganisationSiteId = organisationSiteId;
                                    organisationSiteUser.CreatedBy = loggedInUserId;
                                    organisationSiteUser.CreatedOn = DateTime.Now;
                                    organisationSiteUser.UpdatedBy = loggedInUserId;
                                    organisationSiteUser.UpdatedOn = DateTime.Now;
                                    organisationSiteUsers.Add(organisationSiteUser);
                                }
                                await _userManager.AddToRoleAsync(user, "General Organisation User");
                                await _dbContext.AddRangeAsync(organisationSiteUsers);
                                await _dbContext.SaveChangesAsync();
                            }


                            GenericFunctions genericFunctions = new GenericFunctions(_configuration);

                            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                            var subject = "Set Password";
                            var templateId = _configuration["SendGridConfiguration:SetPasswordTemplateId"];
                            var link = _configuration["SendGridConfiguration:FrontendUrl"] + "/resetpassword?Token=" + token;

                            var emailResponse = genericFunctions.SendEmail(inviteUserDTO.Email, subject, templateId, link, null);
                            if (emailResponse)
                            {
                                responseModel.Id = Guid.Parse(user.Id);
                                response.Message = "Please check your registered email to set your password.";
                            }

                            transaction.Commit();
                            response.Data = responseModel;
                        }
                        else
                        {
                            var isUserExistsSameOrg = await _dbContext.OrganisationUsers.AnyAsync(x => x.UserId == userExists.Id && x.OrganisationId == inviteUserDTO.OrganisationId);
                            var isUserExistsSameOrgSites = await (from orgSites in _dbContext.OrganisationSites
                                                                  join orgs in _dbContext.Organisations on orgSites.OrganisationId equals orgs.OrganisationId
                                                                  join userSites in _dbContext.OrganisationSiteUsers on orgSites.OrganisationSiteId equals userSites.OrganisationSiteId
                                                                  where userSites.UserId.Equals(userExists.Id) && orgs.OrganisationId.Equals(inviteUserDTO.OrganisationId)
                                                                  select userSites).ToListAsync();

                            if (isUserExistsSameOrg || isUserExistsSameOrgSites.Count != 0)
                            {
                                response.Message = "User created already in this organisation! Please check user details and try again.";
                                response.Data = responseModel;
                                return response;
                            }

                            if (inviteUserDTO.IsAdministrator)
                            {
                                OrganisationUser organisationUser = new OrganisationUser();
                                organisationUser.OrganisationId = inviteUserDTO.OrganisationId;
                                organisationUser.UserId = userExists.Id;
                                organisationUser.CreatedBy = loggedInUserId;
                                organisationUser.CreatedOn = DateTime.Now;
                                organisationUser.UpdatedBy = loggedInUserId;
                                organisationUser.UpdatedOn = DateTime.Now;
                                await _userManager.AddToRoleAsync(userExists, "Organisation Administrator");
                                await _dbContext.OrganisationUsers.AddAsync(organisationUser);
                                await _dbContext.SaveChangesAsync();
                                response.Message = "Organisation user created successfully!!";
                            }
                            else
                            {
                                List<OrganisationSiteUser> organisationSiteUsers = new List<OrganisationSiteUser>();
                                foreach (var organisationSiteId in inviteUserDTO.OrganisationSiteIds)
                                {
                                    OrganisationSiteUser organisationSiteUser = new OrganisationSiteUser();
                                    organisationSiteUser.UserId = userExists.Id;
                                    organisationSiteUser.OrganisationSiteId = organisationSiteId;
                                    organisationSiteUser.CreatedBy = loggedInUserId;
                                    organisationSiteUser.CreatedOn = DateTime.Now;
                                    organisationSiteUser.UpdatedBy = loggedInUserId;
                                    organisationSiteUser.UpdatedOn = DateTime.Now;
                                    organisationSiteUsers.Add(organisationSiteUser);
                                }
                                await _userManager.AddToRoleAsync(userExists, "General Organisation User");
                                await _dbContext.AddRangeAsync(organisationSiteUsers);
                                await _dbContext.SaveChangesAsync();
                                response.Message = "Organisation general user created successfully!!";
                            }

                            responseModel.Id = Guid.Parse(userExists.Id);
                            transaction.Commit();
                            response.Data = responseModel;
                        }

                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        response.Message = "Some error occur";
                        response.Data = responseModel;
                    }
                }
                return response;

            }
            catch (Exception ex)
            {
                var message = ex.Message;
                var functionName = "InviteUser";
                _logger.LogError($"Error: {functionName} | {message}");
                throw new Exception(message);
            }
        }

        public async Task<CommonResponse> DeleteOrganisationUser(Guid organisationId, Guid userId)
        {
            try
            {
                CommonResponse response = new CommonResponse();
                ResponseModel responseModel = new ResponseModel();
                using (var transaction = _dbContext.Database.BeginTransaction())
                {
                    try
                    {
                        var isAnyOtherAdminUsersExists = await _dbContext.OrganisationUsers.AnyAsync(x => x.OrganisationId == organisationId && x.UserId != userId.ToString());
                        if (!isAnyOtherAdminUsersExists)
                        {
                            response.Message = "An organisation should contain at least one admin user";
                            response.Data = responseModel;
                            return response;
                        }

                        var userAssociatedOrgs = 0;
                        var userOrganisations = _dbContext.OrganisationUsers.AsNoTracking().Where(x => x.UserId.Trim().ToLower() == userId.ToString().Trim().ToLower()).ToList();
                        var organisationUsersToDelete = userOrganisations.Where(x => x.OrganisationId == organisationId).ToList();
                        _dbContext.OrganisationUsers.RemoveRange(organisationUsersToDelete);

                        userAssociatedOrgs += (organisationUsersToDelete.Count);

                        var userOrganisationSiteIds = _dbContext.OrganisationSiteUsers.AsNoTracking().Where(x => x.UserId == userId.ToString()).Select(x => x.OrganisationSiteId).ToList();
                        var userAssociatedOrganisationIds = _dbContext.OrganisationSites.AsNoTracking().Where(x => x.OrganisationId == organisationId && userOrganisationSiteIds.Contains(x.OrganisationSiteId)).Select(x => x.OrganisationId).Distinct().ToList();

                        var orgUserSiteIds = _dbContext.OrganisationSites.AsNoTracking().Where(x => x.OrganisationId == organisationId).Select(x => x.OrganisationSiteId).ToList();
                        var orgUserSiteIdsToDelete = _dbContext.OrganisationSiteUsers.AsNoTracking().Where(x => x.UserId.Trim().ToLower() == userId.ToString().Trim().ToLower() && orgUserSiteIds.Contains(x.OrganisationSiteId)).ToList();
                        _dbContext.OrganisationSiteUsers.RemoveRange(orgUserSiteIdsToDelete);

                        userAssociatedOrgs += (userAssociatedOrganisationIds.Count);

                        var userDetails = await _dbContext.UserDetails.AsNoTracking().Distinct().Where(x => x.UserId == userId.ToString()).SingleOrDefaultAsync();
                        var user = await _dbContext.Users.AsNoTracking().Distinct().Where(x => x.Id == userId.ToString()).SingleOrDefaultAsync();
                        var userRoles = await _dbContext.UserRoles.AsNoTracking().Distinct().Where(x => x.UserId == userId.ToString()).ToListAsync();

                        if (userAssociatedOrgs == 1)
                        {
                            _dbContext.UserDetails.Remove(userDetails);
                            _dbContext.UserRoles.RemoveRange(userRoles);
                            _dbContext.Users.Remove(user);
                        }
                        else if (organisationUsersToDelete.Count == 1)
                        {
                            var roleId = (from ur in _dbContext.UserRoles
                                          where ur.UserId == userId.ToString() && (ur.Role.Name == "Organisation Administrator")
                                          select (ur.Role.Id)).ToList();
                            var userRole = userRoles.Where(x => roleId.Contains(x.RoleId));
                            _dbContext.UserRoles.RemoveRange(userRole);
                        }
                        else if (userAssociatedOrganisationIds.Count == 1)
                        {
                            var roleId = (from ur in _dbContext.UserRoles
                                          where ur.UserId == userId.ToString() && (ur.Role.Name == "General Organisation User")
                                          select (ur.Role.Id)).ToList();
                            var userRole = userRoles.Where(x => roleId.Contains(x.RoleId));
                            _dbContext.UserRoles.RemoveRange(userRoles);
                        }

                        _dbContext.SaveChanges();
                        transaction.Commit();
                        responseModel.Id = Guid.Parse(user.Id);
                        response.Message = "Deleted successfully";
                        response.Data = responseModel;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        responseModel.Id = Guid.Empty;
                        response.Message = "Some error occur";
                        response.Data = responseModel;
                    }
                }
                return response;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                var functionName = "DeleteOrganisationUser";
                _logger.LogError($"Error: {functionName} | {message}");
                throw new Exception(message);
            }
        }
    }
}
