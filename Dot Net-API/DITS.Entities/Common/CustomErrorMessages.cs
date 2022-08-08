using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Entities.Common
{
   public static class CustomErrorMessages
    {

        public static readonly string INVALID_INPUTS = "Request contains invalid parameters. Please try again later.";
        public static readonly string INTERNAL_ERROR = "Something went wrong. Please try again later.";
        public static readonly string RECORD_NOT_FOUND = "Record Not Found";
        public static readonly string INVALID_USERNAME_PASSWORD = "Invalid UserName or Password";
        public static readonly string INVALID_EMAIL = "Email is not valid. Please try again.";
        public static readonly string TOKEN_EXPIRED = "Your session is expired. Please log in again.";
        public static readonly string UNAUTHORIZED_ACCESS = "Sorry. Unauthorized access";
        public static readonly string USER_DOES_NOT_EXISTS = "User does not Exist";
        public static readonly string OLDPASSWORD_NOTMATCHED = "Old Password is not matched";
        public static readonly string PASSWORD_CHANGEDSUCCESSFULLY = "Password is changed successfully";
    }
}
