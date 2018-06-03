using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Nistec.Data;
using Nistec.Web.Security;
using Nistec;


namespace Pro.Data.Entities
{

   
     public class AdsView : EntityItem<DbNatam>, IEntityItem
    {
        #region override

         public override string MappingName()
        {
            return "Crm_Ads";
        }
        
        public override EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        {
            EntityValidator validator = new EntityValidator("פרסום", "he");
            validator.Required(PropertyId, "קוד נכס");
            return validator;
        }
        #endregion

        public static IEnumerable<AdsView> View()
        {
            return DbNatam.Instance.EntityItemList<AdsView>(TableName, null);
        }

        public static IEnumerable<AdsView> FilterByAgent(int AgentId)
        {
            if (AgentId < 0)
                return View();
            return DbNatam.Instance.EntityItemList<AdsView>(TableName, "AgentId", AgentId);
        }

        public static IEnumerable<AdsView> FilterByProperty(int PropertyId)
        {
            if (PropertyId < 0)
                return View();
            return DbNatam.Instance.EntityItemList<AdsView>(TableName, "PropertyId", PropertyId);
        }


        public static AdsView View(int AdsId)
        {
            var ads = DbNatam.Instance.EntityItemGet<AdsView>(TableName, "AdsId",AdsId);
            var property = UnitBuildingInfoView.ViewUnitBuildingInfo(ads.PropertyId);
            if (property != null)
            {
                ads.Address = property.Address;
                //ads.BuildingName = property.BuildingName;
            }
            ads.AgentName = UserProfile.LookupUserName(ads.AgentId);
            return ads;
        }

        public static AdsView Create(int PropertyId,int PropertyType, int AgentId)
        {
            if (PropertyType == 1)//unit
            {
                return CreateAdsFromUnitInfo(PropertyId, AgentId);
            }
            if (PropertyType == 3)//plots
            {
                return CreateAdsFromPlotsInfo(PropertyId, AgentId);
            }

            return new AdsView();
        }
        public static AdsView CreateAdsFromUnitInfo(int PropertyId, int AgentId)
        {
                var property = UnitBuildingInfoView.ViewUnitBuildingInfo(PropertyId);
                if (property == null)
                    return new AdsView()
                    {
                        PropertyId = PropertyId,
                        PropertyType = 1,
                        AgentId = AgentId,
                        AgentName = UserProfile.LookupDisplayName(AgentId)
                    };

            AdsView ads = new AdsView()
            {
                Description = property.Memo,
                Details = string.Format("{0}:{1} \n{2}:{3} \n{4}:{5}", "קומה", property.FloorNum, "שטח", property.UnitSize, "מחיר למ''ר", property.Price),
                PropertyId = PropertyId,
                PropertyType=1,
                PurposeId=property.PurposeId,
                AgentId = AgentId,
                Address = property.Address,
                //BuildingName = property.BuildingName,
                AgentName = UserProfile.LookupDisplayName(AgentId)
            };
            return ads;
        }

        public static AdsView CreateAdsFromPlotsInfo(int PropertyId, int AgentId)
        {
            var property = PlotsContext.Get(PropertyId);
            if (property == null)
                return new AdsView()
                {
                    PropertyId = PropertyId,
                    PropertyType = 3,
                    AgentId = AgentId,
                    AgentName = UserProfile.LookupDisplayName(AgentId)
                };

            AdsView ads = new AdsView()
            {
                Description = property.Memo,
                Details = string.Format("{0}:{1} \n{2}:{3}", "שטח", property.Size, "מחיר לדונם", property.Price),
                PropertyId = PropertyId,
                PropertyType = 3,
                PurposeId = 1,//none
                AgentId = AgentId,
                Address = string.Format("{0} {1} {2}", property.Street, property.StreetNo, property.City),
                //BuildingName ="",
                AgentName = UserProfile.LookupDisplayName(AgentId)
            };
            return ads;
        }

        public static int DoSave(AdsView v)
        {
            var args = new object[]{
                 "AdsId", v.AdsId,3
                ,"PropertyId", v.PropertyId,0
                ,"AgentId", v.AgentId,0
                ,"Note", v.Note,0
                ,"AdsDate", v.AdsDate,0
                ,"Status", v.Status,0
                ,"Description", v.Description,0
                ,"MediaType", v.MediaType,0
                ,"AdsEnd", v.AdsEnd,3
                ,"AdsState", 0,2
                ,"AdsCode",v.AdsCode,0
                ,"Details",v.Details,0
                ,"PropertyType",v.PropertyType,0
                ,"PurposeId",v.PurposeId,0
            };
            var parameters = DataParameter.GetSqlWithDirection(args);
            int res = DbNatam.Instance.ExecuteCommandNonQuery("sp_Ads_Add", parameters, System.Data.CommandType.StoredProcedure);
            var AdsState = parameters.GetParameterValue<int>("AdsState");
            v.AdsId = parameters.GetParameterValue<int>("AdsId");
            v.AdsEnd = parameters.GetParameterValue<DateTime>("AdsEnd");

            return AdsState;
        }
      
        public static int DoDelete(int AdsId)
        {
            return DbNatam.Instance.EntityItemDelete(TableName, "AdsId", AdsId);
        }

        public const string TableName = "Crm_Ads";

     
        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int AdsId
        {
            get;
            set;
        }
        
        public int PropertyId
        {
            get;
            set;
        }
        public int PropertyType
        {
            get;
            set;
        }
        public int AgentId
        {
            get;
            set;
        }
        
        public int PurposeId
        {
            get;
            set;
        }
        //public int UnitNum
        //{
        //    get;
        //    set;
        //}

        //public string AdsOptions
        //{
        //    get;
        //    set;
        //}

        public DateTime AdsDate
        {
            get;
            set;
        }
        
        public DateTime AdsEnd
        {
            get;
            set;
        }
        
        public int Status
        {
            get;
            set;
        }
          
        public string Description
        {
            get;
            set;
        }
        public string Note
        {
            get;
            set;
        }
        public int MediaType
        {
            get;
            set;
        }
        
        public DateTime Creation
        {
            get;
            set;
        }
        public string AdsCode
        {
            get;
            set;
        }
        public string Details
        {
            get;
            set;
        }
        [EntityProperty(EntityPropertyType.View)]
        public string Address
        {
            get;
            set;
        }
        //[EntityProperty(EntityPropertyType.View)]
        //public string BuildingName
        //{
        //    get;
        //    set;
        //}
        [EntityProperty(EntityPropertyType.View)]
        public string AgentName
        {
            get;
            set;
        }
        public DateTime? StatusModified
        {
            get;
            set;
        }
        public string AdsStreet
        {
            get;
            set;
        }
        public string AdsQuarter
        {
            get;
            set;
        }
        #endregion


    }

    public class AdsPropertyView : AdsView,IEntityItem
     {
         public const string ViewName = "vw_Crm_Ads";

         public static IEnumerable<AdsPropertyView> GetAdsView(AdsViewType ViewType, int Id, AdsStateView Status)
         {
             return DbNatam.Instance.ExecuteList<AdsPropertyView>("sp_Ads_View", "ViewType", (int)ViewType, "Id", Id, "Status", (int)Status);
         }
         /*
         public static IEnumerable<AdsPropertyView> ViewByProperty(int PropertyId, int Status = 255)
         {
             if (PropertyId < 0)
                 return ViewAll(Status);
             object[] args = Status == 255 ? new object[] { "PropertyId", PropertyId } : new object[] { "PropertyId", PropertyId,"Status", Status };
             return DbNatam.Instance.EntityItemList<AdsPropertyView>(ViewName, args);
         }

         public static IEnumerable<AdsPropertyView> ViewByAgent(int AgentId, int Status = 255)
         {
             if (AgentId < 0)
                 return ViewAll(Status);
             object[] args = Status == 255 ? new object[] { "AgentId", AgentId } : new object[] { "AgentId", AgentId, "Status", Status };
             return DbNatam.Instance.EntityItemList<AdsPropertyView>(ViewName, args);
         }

         public static IEnumerable<AdsPropertyView> ViewAll(int Status = 255)
         {
             object[] args = Status == 255 ? null : new object[] { "Status", Status };
             return DbNatam.Instance.EntityItemList<AdsPropertyView>(ViewName, args);
         }

         public static AdsPropertyView ViewByAds(int AdsId)
         {
             return DbNatam.Instance.EntityItemGet<AdsPropertyView>(ViewName, "AdsId",AdsId);
         }
         */
         public string AdsTypeName
         {
             get;
             set;
         }
         public string AreaName
         {
             get;
             set;
         }
         
         public string PurposeName
         {
             get;
             set;
         }
         
         public string DealName
         {
             get;
             set;
         }
          //
          //public string Address
          //{
          //    get;
          //    set;
          //}
          
          public string StatusName
          {
              get;
              set;
          }
         
         public int? AreaId
         {
             get;
             set;
         }

         public int? FloorNum
         {
             get;
             set;
         }
         
         //public string BuildingName
         //{
         //    get;
         //    set;
         //}
         //
         //public int PropertyPurpose
         //{
         //    get;
         //    set;
         //}

         
         //public int? FloorNo
         //{
         //    get;
         //    set;
         //}
        //
        //public string PropertyDesc
        //{
        //    get;
        //    set;
        //}

     }

     public class AdsType : IEntityItem
     {
         public string AdsTypeId { get; set; }
         public string AdsTypeName { get; set; }
     }
}
