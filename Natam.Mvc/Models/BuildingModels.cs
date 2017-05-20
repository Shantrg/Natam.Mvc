using Nistec;
using Pro.Data.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Globalization;
using System.Web.Mvc;
using System.Web.Security;

namespace Natam.Mvc.Models
{
    public class Client
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
    public class BuildingModel
    {
        public int BuildingId { get; set; }
        public string BuildingName { get; set; }
    }
    public class BuildingFloorsModel
    {
        public int BuildingId { get; set; }
        public string BuildingName { get; set; }
        public int FloorNoUp { get; set; }
         public int FloorNoDown { get; set; }
    }
    public class BuildingWizardModel
    {
        public BuildingWizardModel(System.Collections.Specialized.NameValueCollection Form)
        {
            BuildingId = Types.ToInt(Form["BuildingId"]);
            NumOfFloor = Types.ToInt(Form["NumOfFloor"]);
            StartFloor = Types.ToInt(Form["StartFloor"]);
            BuildingSize = Types.ToInt(Form["BuildingSize"]);
            DefaultPurpose = Types.ToInt(Form["DefaultPurpose"]);
            DefaultFloorHeight = Types.ToFloat(Form["DefaultFloorHeight"],0);
            DefaultFloorArea = Types.ToFloat(Form["DefaultFloorArea"],0);
            WizardKey = Guid.NewGuid().ToString();
            BuildingName = BuildingContext.LookupBuildingName(BuildingId);


        }
        public BuildingWizardModel()
        {
        }
        public int BuildingId { get; set; }
        public string BuildingName { get; set; }
        public int NumOfFloor { get; set; }
        public int StartFloor { get; set; }
        public int BuildingSize { get; set; }
        public int DefaultPurpose { get; set; }
        public float DefaultFloorHeight { get; set; }
        public float DefaultFloorArea { get; set; }
        public string WizardKey { get; set; }
        public string Message { get; set; }
    }
}
