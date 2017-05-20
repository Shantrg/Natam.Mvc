using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Natam.Mvc.Models
{

    public class UserModel
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int UserRole { get; set; }
        //public int AccountId { get; set; }
    }


    public class ResultModel
    {
        public int Status { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string Link { get; set; }
        public int OutputId { get; set; }

    }

    public class MediaModel
    {
        public int BuildingId { get; set; }
        public int UnitId { get; set; }
        public string PropertyType { get; set; }
    }

    public class InfoModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Value { get; set; }
    }
    
    public class UploadFile
    {
        public int FileId { get; set; }
        public string FileName { get; set; }
        public int FileSize { get; set; }

    }

    public class Employee
    {
        //public int Status { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Title { get; set; }
        public DateTime BirthDate { get; set; }
    }

   
}