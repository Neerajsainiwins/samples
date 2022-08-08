using Admin.Application.Models;
using Admin.Application.Models.Base;
using Admin.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Admin.Application.CommonFunctions
{
    public static class ResponseMessages
    {
        public static string Create="Created successfully";
        public static string Save = "Saved successfully";
        public static string Delete = "Deleted successfully";
        public static string InternalServerError = "Something went wrong.Please try again!";
        public static string Fr_Create = "Créé avec succèsd";
        public static string Fr_Save = "Enregistré avec succèsd";
        public static string Fr_Delete = "Supprimé avec succèsd";
        public static string Fr_InternalServerError = "Une erreur s'est produite. Veuillez réessayer!";
    }
}
