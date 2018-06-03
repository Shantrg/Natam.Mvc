using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;
using Nistec;

namespace Pro.Data.Entities
{

    public class PropertyView : UnitView
    {
        [Validator("קוד לקוח", true)]
        public int ParentId { get; set; }
        public string UnitAddress { get; set; }

        public static int DoSave(PropertyView v)
        {
            var args = new object[]{
 "UnitId", v.UnitId
 ,"Status", 0
,"BuildingId", v.BuildingId
,"FloorNum", v.FloorNum
,"UnitNum", v.UnitNum
,"UnitDescription", v.UnitDescription
,"UnitSize", v.UnitSize
,"DealType", v.DealType
,"PurposeId", v.PurposeId
,"Populate", v.Populate
,"Price", v.Price
,"OwnerId", v.OwnerId
,"TenantId", v.TenantId
,"DateEndContract", v.DateEndContract
,"DateEndOption1", v.DateEndOption1
,"DateEndOption2", v.DateEndOption2
,"Memo", v.Memo
,"AgentId", v.AgentId
,"PropertyType", v.PropertyType
,"ParentId",v.ParentId
,"UnitAddress",v.UnitAddress

            };
            var parameters = DataParameter.GetSql(args);
            parameters[0].Direction = System.Data.ParameterDirection.InputOutput;
            parameters[1].Direction = System.Data.ParameterDirection.InputOutput;
            int res = DbNatam.Instance.ExecuteCommandNonQuery("sp_Unit_Save", parameters, System.Data.CommandType.StoredProcedure);
            v.UnitId = Types.ToInt(parameters[0].Value);
            var status = Types.ToInt(parameters[1].Value);
            return status;

        }

        public static IEnumerable<PropertyInfoView> QueryProperty(
            int PropertyType,
            int ParentId,
            int AgentId,
            string DealType,
            string PurposeType,
            string AreaType,
            string RequestSize
            )
        {
            return DbNatam.Instance.ExecuteList<PropertyInfoView>("sp_Query_Property", "PropertyType", PropertyType, "ParentId", ParentId, "AgentId", AgentId, "DealType", DealType, "PurposeType", PurposeType, "AreaType", AreaType, "RequestSize", RequestSize);
        }

        // public static IEnumerable<PropertyInfoView> QueryLeadsProperty(
        //    int LeadId,
        //    int AgentId,
        //    string DealType,
        //    string PurposeType,
        //    string AreaType,
        //    string RequestSize
        //    )
        //{
        //    return DbNatam.Instance.ExecuteQuery<PropertyInfoView>("sp_Leads_List_Query", "LeadId", LeadId, "AgentId", AgentId, "DealType", DealType, "PurposeType", PurposeType, "AreaType", AreaType, "RequestSize", RequestSize);
        //}
        
    }

    public class LeadPropertyItem : PropertyInfoView
    {

        public string Comment { get; set; }
    }

     public class PropertyInfoView : IEntityItem
    {
 
        public string PropertyName { get; set; }

        public string BuildingName { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string UserName { get; set; }

        public string OwnerName { get; set; }

        public string PurposeName { get; set; }

        public string DealName { get; set; }

        //==============================

       
      public int AreaId { get; set; }
      public int UnitId { get; set; }
      public int BuildingId { get; set; }
      public int FloorNum { get; set; }
      public int UnitNum { get; set; }
      public string UnitDescription { get; set; }
      public int UnitSize { get; set; }
      public int DealType { get; set; }
      public int PurposeId { get; set; }
      public bool Populate { get; set; }
      public int Price { get; set; }
      public int OwnerId { get; set; }
      public int TenantId { get; set; }
      public DateTime DateEndContract { get; set; }
      public DateTime LastUpdate { get; set; }
      public string Memo { get; set; }
      public int AgentId { get; set; }
      public int PropertyType { get; set; }
     

    }

    /*
    [Entity(EntityName = "PropertyView", MappingName = "Crm_Building_Properties", ConnectionKey = "cnn_natam", EntityKey = new string[] { "PropertyId" })]
    public class PropertyContext : EntityContext<PropertyView>
    {
        #region ctor

        public PropertyContext()
        {
        }

        public PropertyContext(int PropertyId)
            : base(PropertyId)
        {
        }

        #endregion

        #region update

        public static int DoSave(int id, PropertyView bv, UpdateCommandType commandType)
        {
            if (commandType == UpdateCommandType.Delete)
                using (PropertyContext context = new PropertyContext(id))
                {
                    return context.SaveChanges(commandType);
                }

            EntityValidator.Validate(bv, "נכס", "he");

            if (commandType == UpdateCommandType.Insert)
                using (PropertyContext context = new PropertyContext())
                {
                    context.Set(bv);
                    return context.SaveChanges(commandType);
                }

            if (commandType == UpdateCommandType.Update)
                using (PropertyContext context = new PropertyContext(id))
                {
                    context.Set(bv);
                    return context.SaveChanges(commandType);
                }
            return 0;
        }

        public static int DoSave(PropertyView bv)
        {
            EntityValidator.Validate(bv, "נכס", "he");
            
            using (PropertyContext context = new PropertyContext())
            {
                UpdateCommandType cmdtype = UpdateCommandType.Insert;
                if (bv.PropertyId > 0)
                {
                    context.SetEntity(bv.PropertyId);
                    cmdtype = UpdateCommandType.Update;
                }
                context.Set(bv);
                return context.SaveChanges(cmdtype);
            }
        }

        public static int DoSavePic(int id, string field, string filename)
        {
            return DbNatam.Instance.ExecuteCommand("update Crm_Building_Properties set " + field + "=@" + field + " where PropertyId=@PropertyId", field, filename, "PropertyId", id);
        }

        #endregion

        #region static

        public static PropertyView Get(int id)
        {
            using (PropertyContext context = new PropertyContext(id))
            {
                return context.Entity;
            }
        }

        public static IEnumerable<PropertyView> View(int BuildingId)
        {
            using (PropertyContext context = new PropertyContext())
            {
                return context.EntityList(DataFilter.GetSql("BuildingId=@BuildingId", BuildingId));
            }
        }

        public static IEnumerable<PropertyInfoView> ViewByBuilding(int BuildingId)
        {
            return DbNatam.Instance.ExecuteQuery<PropertyInfoView>("sp_Query_Property", "BuildingId", BuildingId);
        }

        #endregion

    }

    public class PropertyInfoView : PropertyView
    {
        
        public string UserName { get; set; }
        
        public string OwnerName { get; set; }
        
        public string PurposeName { get; set; }
        // 
        //public string DealName { get; set; }
    }

    public class PropertyView : IEntityItem
    {


        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int PropertyId { get; set; }
        
        [Validator("קוד בניין", true)]
        public int BuildingId { get; set; }
        
        public int FloorNum { get; set; }
        
        public int PropertyNum { get; set; }
        
        public int PropertySize { get; set; }
        
        public string PropertyDescription { get; set; }
        
        public string DealType { get; set; }       
        
        public int PurposeId { get; set; }
        
        public bool Populate { get; set; }
        
        public float Price { get; set; }
        
        public int OwnerId { get; set; }
        
        public int TenantId { get; set; }
        
        public DateTime? DateEndContract { get; set; }
        
        public DateTime LastUpdate { get; set; }
        
        public string Memo { get; set; }
        
        public int AgentId { get; set; }
        //
        //public string ContactName { get; set; }
        //
        //public string ContactPhone { get; set; }
        //
        //public string ContactMobile { get; set; }
        //
        //public string ContactMail { get; set; }
        //
        //public string Pic1 { get; set; }
        //
        //public string Pic2 { get; set; }
        //
        //public string Pic3 { get; set; }
        #endregion

    }
 */
}
