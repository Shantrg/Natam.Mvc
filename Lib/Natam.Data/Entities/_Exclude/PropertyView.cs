using Pro.Data;
using Nistec.Data;
using Nistec.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Pro.Data.Entities
{

    [Entity(EntityName = "PropertyView", MappingName = "Crm_PropertyInfo", ConnectionKey = "cnn_natam", EntityKey = new string[] { "PropertyId" })]
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

        #region binding

        //public override string GetCulture()
        //{
        //    return AdventureWorksResources.GetCulture();
        //}

        protected override void EntityBind()
        {
            //base.EntityDb.EntityCulture = NatamCrmResources.GetCulture();
            //If EntityAttribute not define you can initilaize the entity here
            //base.InitEntity<AdventureWorks>("Contact", "Person.Contact", EntityKeys.Get("ContactID"));
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

        //public static DataTable GetList()
        //{
        //    DataTable dt = null;
        //    using (IDbCmd cmd = DbNatam.Instance.DbCmd())
        //    {
        //        dt = cmd.ExecuteCommand<DataTable>("select top 10 * from Person.Contact", true);
        //    }

        //    return dt;
        //}

        public static IList<PropertyView> GetItems()
        {
            using (PropertyContext context = new PropertyContext())
            {
                return context.EntityList();
            }
        }

        public static IEnumerable<PropertyQueryView> ViewByBuilding(int BuildingId)
        {
            return DbNatam.Instance.Query<PropertyQueryView>("sp_Query_Property", "QueryType", 4, "@IArg", BuildingId);
        }

        public static IEnumerable<PropertyQueryView> ViewByAddress(
            string BuildingName,
            string BuildingStreet,
            int BuildingNo)
        {
            return DbNatam.Instance.ExecuteQuery<PropertyQueryView>("sp_Query_Property", "QueryType", 2, "@IArg", 0, "AreaId", null, "DealType", 0, "PurposeType", 0, "SizeMin", 0, "SizeMax", 0, "BuildingName", BuildingName, "BuildingStreet", BuildingStreet, "BuildingNo", BuildingNo);
        }

        public static IEnumerable<PropertyQueryView> View(
           string AreaId,
           int DealType,
           int PurposeType,
           int SizeMin,
           int SizeMax
           )
        {
            return DbNatam.Instance.ExecuteQuery<PropertyQueryView>("sp_Query_Property", "QueryType", 1, "@IArg", 0, "AreaId", AreaId, "DealType", DealType, "PurposeType", PurposeType, "SizeMin", SizeMin, "SizeMax", SizeMax);
        }

        #endregion
    }


    public class PropertyView : EntityItem<DbNatam>, IEntityItem
    {
        #region override

        public override string MappingName()
        {
             return "Crm_PropertyInfo"; 
        }
 
        public override EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        {
            EntityValidator validator = new EntityValidator("עדכון נכס", "he");

            validator.Required(BuildingName, "שם בניין");
            validator.Required(Street, "רחוב");
            validator.Required(City, "עיר");
            //validator.Requier(StreetNo, "מס בניין");
            return validator;
        }
        #endregion
   
        public static IEnumerable<PropertyView> View()
        {
            return DbNatam.Instance.QueryEntityList<PropertyView>(TableName, null);
        }
             


        public static PropertyView View(int PropertyId)
        {
            return DbNatam.Instance.QueryEntity<PropertyView>(TableName,"PropertyId", PropertyId);
        }
        //public static PropertyView Current(int PropertyId)
        //{
        //    if (PropertyId > 0)
        //        return View(PropertyId);
        //    return new PropertyView();
        //}
        public const string TableName = "Crm_PropertyInfo";


        [EntityProperty(EntityPropertyType.Identity)]
        public int PropertyId { get; set; }
        [EntityProperty]
        public int BuildingId { get; set; }
        [EntityProperty]
        public string BuildingName { get; set; }
        [EntityProperty]
        public int AgentId { get; set; }
        [EntityProperty]
        public int? AreaId { get; set; }
        [EntityProperty]
        public string Street { get; set; }
        [EntityProperty]
        public int? StreetNo { get; set; }
        [EntityProperty]
        public string City { get; set; }
        [EntityProperty]
        public int? ZipCode { get; set; }
        [EntityProperty]
        public int? FloorNo { get; set; }
        [EntityProperty]
        public int FloorAreaMr { get; set; }
        [EntityProperty]
        public int FloorAreaMin { get; set; }
        [EntityProperty]
        public int FloorAreaMax { get; set; }
        [EntityProperty]
        public int? ParkingNo { get; set; }
        [EntityProperty]
        public int? ElevatorsNo { get; set; }
        [EntityProperty]
        public DateTime? PopulationDate { get; set; }
        [EntityProperty]
        public float? PriceMrSale { get; set; }
        [EntityProperty]
        public float? PriceMrRent { get; set; }
        [EntityProperty]
        public int BuildingPurpose { get; set; }
        [EntityProperty]
        public int DealType { get; set; }
        [EntityProperty]
        public int? ManagmentCompany { get; set; }
        [EntityProperty]
        public int? BuildingOwnerId { get; set; }
        [EntityProperty]
        public string OwnerInfo { get; set; }
        [EntityProperty]
        public string ContactName { get; set; }
        [EntityProperty]
        public string ContactPhone { get; set; }
        [EntityProperty]
        public string BuildingInformation { get; set; }
        [EntityProperty]
        public string BuildingComments { get; set; }
        [EntityProperty]
        public string BuildingInfoAdded { get; set; }
        [EntityProperty]
        public string BuildingInfoStatus { get; set; }
        [EntityProperty]
        public int? AgentIdApproved { get; set; }
        [EntityProperty]
        public string AgentApprovedComments { get; set; }
        [EntityProperty]
        public DateTime? AgentApprovedTime { get; set; }

        [EntityProperty]
        public string PropertyDesc { get; set; }

        //ex properties

        [EntityProperty(EntityPropertyType.NA)]
        public string Address
        {
            get { return string.Format("{0} {1}, {2}", Street, StreetNo, City); }
        }
    }

    public class PropertyQueryView : PropertyView, IEntityItem
    {
       


        public static IEnumerable<PropertyQueryView> View(
           int QueryType,
           string AreaId,
           int DealType,
           int PurposeType,
           int SizeMin,
           int SizeMax,
           string BuildingName,
           string BuildingStreet,
           int BuildingNo
           )
        {
            var parameters = new object[] { "QueryType", QueryType, "AreaId", AreaId, "DealType", DealType, "PurposeType", PurposeType, "SizeMin", SizeMin, "SizeMax", SizeMax, "BuildingName", BuildingName, "BuildingStreet", BuildingStreet, "BuildingNo", BuildingNo};
            return DbNatam.Instance.ExecuteQuery<PropertyQueryView>("sp_Property_Query", parameters);//, System.Data.CommandType.StoredProcedure);
        }

        public static IEnumerable<PropertyQueryView> ViewByAddress(
            string BuildingName,
            string BuildingStreet,
            int BuildingNo)
        {
            //var parameters = DataParameter.GetSql("AreaId", AreaId, "DealType", DealType, "PurposeType", PurposeType, "SizeMin", SizeMin, "SizeMax", SizeMax, "BuildingName", BuildingName, "BuildingStreet", BuildingStreet, "BuildingNo", BuildingNo);
            var parameters = new object[] { "BuildingName", BuildingName, "BuildingStreet", BuildingStreet, "BuildingNo", BuildingNo };
            return DbNatam.Instance.ExecuteQuery<PropertyQueryView>("sp_Property_Query_ByAddress", parameters);//, System.Data.CommandType.StoredProcedure);
        }

        [EntityProperty]
        public string UserName { get; set; }
        [EntityProperty]
        public string OwnerName { get; set; }

    }
}
