using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;
using Nistec;
using System.Collections.Specialized;

namespace Pro.Data.Entities
{

    [Entity(EntityName = "BuildingView", MappingName = "Crm_Building", ConnectionKey = "cnn_natam", EntityKey = new string[] { "BuildingId" })]
    public class BuildingContext : EntityContext<BuildingView>
    {
        #region ctor

        public BuildingContext()
        {
        }

        public BuildingContext(int BuildingId)
            : base(BuildingId)
        {
        }
        public BuildingContext(BuildingView entity)
            : base(entity)
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

        #region update

        //public EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        //{
        //    EntityValidator validator = new EntityValidator("עדכון בניין", "he");
        //    var entity = Entity;
        //    validator.Required(entity.BuildingName, "שם בניין");
        //    validator.Required(entity.Street, "רחוב");
        //    validator.Required(entity.City, "עיר");
        //    validator.Required(entity.StreetNum, "מס בניין");
        //    return validator;
        //}

        //public static int DoUpdate(int id,BuildingView bv,string title ,string lang)
        //{
        //    using (BuildingContext context = new BuildingContext(id))
        //    {
        //        var result = context.Validate(title, lang);
        //        if(!result.IsValid)
        //        {
        //            throw new EntityException(result.Result);
        //        }
        //        return context.SaveChanges(UpdateCommandType.Update);//.Update<BuildingView>(bv, context.Validate);
        //    }
        //}


        public static int DoActiveState(int BuildingId,int ActiveState)
        {
            int res = DbNatam.Instance.ExecuteNonQuery("sp_Building_Change_State", "BuildingId", BuildingId, "ActiveState", ActiveState);
            return res;
        }

        public static string BuildingPrices(int BuildingId)
        {
            string res = DbNatam.Instance.QueryJson("vw_Building_Prices", "BuildingId", BuildingId);
            return res;
        }
        public static int CalcBuildingPrices(int BuildingId)
        {
            int res = DbNatam.Instance.ExecuteNonQuery("sp_Building_Price_Update_All", "BuildingId", BuildingId);
            return res;
        }
        public static int DoSave(BuildingView bv)
        {

            //[sp_Building_Save]
            var args=new object[]{
"BuildingId",bv.BuildingId 
,"BuildingName",bv.BuildingName 
,"AreaId",bv.AreaId
,"Street",bv.Street
,"StreetNo",bv.StreetNo
,"City",bv.City
,"ZipCode",bv.ZipCode
,"PurposeType",bv.PurposeType
,"ElevatorNo",bv.ElevatorNo
,"BuildingPopulateTime",bv.BuildingPopulateTime
,"SecurityCompany",bv.SecurityCompany
,"ParkingNo",bv.ParkingNo
,"Investment",bv.Investment
,"BuildingGrossNet", bv.BuildingGrossNet
,"OverloadGround",bv.OverloadGround
,"OverloadUp",bv.OverloadUp
,"ManagementFees",bv.ManagementFees
,"AgentId",bv.AgentId
,"AirConditionType",bv.AirConditionType
,"ManagementCompany",bv.ManagementCompany
,"BuildingOwnerId",bv.BuildingOwnerId
,"PicPath",bv.PicPath
,"Memo",bv.Memo
,"ParkingType",bv.ParkingType
,"ParkingPrice",bv.ParkingPrice
,"ManagementContact",bv.ManagementContact
,"BuildingSteward",bv.BuildingSteward
,"ActiveState",bv.ActiveState
,"MailOnChanges",bv.MailOnChanges};
            var parameters=DataParameter.GetSql(args);
            parameters[0].Direction = System.Data.ParameterDirection.InputOutput;
            int res= DbNatam.Instance.ExecuteNonQuery("sp_Building_Save", parameters, System.Data.CommandType.StoredProcedure );
            bv.BuildingId = Types.ToInt( parameters[0].Value);
            return res;
            //using (BuildingContext context = new BuildingContext())
            //{
            //    UpdateCommandType cmdtype = UpdateCommandType.Insert;
            //    if (bv.BuildingId > 0)
            //    {
            //        context.SetEntity(bv.BuildingId);
            //        cmdtype = UpdateCommandType.Update;
            //    }
            //    context.Set(bv);
                
            //    //EntityValidator.Validate<BuildingView>(bv, "", "");

            //    //var result = context.Validate("הגדרת בניין", "he");
            //    //if (!result.IsValid)
            //    //{
            //    //    throw new EntityException(result.Result);
            //    //}
            //    return context.SaveChanges(cmdtype);
            //}
        }


             public static int DoInsert(BuildingNewView bv)
        {

            //[sp_Building_Save]
            var args=new object[]{
"BuildingId",bv.BuildingId 
,"BuildingName",bv.BuildingName 
,"AreaId",bv.AreaId
,"Street",bv.Street
,"StreetNo",bv.StreetNo
,"City",bv.City
,"ZipCode",bv.ZipCode
,"PurposeType",bv.PurposeType
,"ElevatorNo",bv.ElevatorNo
,"BuildingPopulateTime",bv.BuildingPopulateTime
,"SecurityCompany",bv.SecurityCompany
,"ParkingNo",bv.ParkingNo
,"Investment",bv.Investment
,"BuildingGrossNet", bv.BuildingGrossNet
,"OverloadGround",bv.OverloadGround
,"OverloadUp",bv.OverloadUp
,"ManagementFees",bv.ManagementFees
,"AgentId",bv.AgentId
,"AirConditionType",bv.AirConditionType
,"ManagementCompany",bv.ManagementCompany
,"BuildingOwnerId",bv.BuildingOwnerId
,"PicPath",bv.PicPath
,"Memo",bv.Memo
,"ParkingType",bv.ParkingType
,"ParkingPrice",bv.ParkingPrice
,"ManagementContact",bv.ManagementContact
,"BuildingSteward",bv.BuildingSteward
,"ActiveState",bv.ActiveState
,"FloorsUp",bv.FloorsUp
,"FloorsDown",bv.FloorsDown
,"FloorSize",bv.FloorSize
,"FloorSizeUp",bv.FloorSizeUp
,"FloorSizeDown",bv.FloorSizeDown
,"Purp1",bv.Purp1
,"PurpFloor1",bv.PurpFloor1
,"Purp2",bv.Purp2
,"PurpFloor2",bv.PurpFloor2
,"Purp3",bv.Purp3
,"PurpFloor3",bv.PurpFloor3
,"Purp4",bv.Purp4
,"PurpFloor4",bv.PurpFloor4
,"Purp5",bv.Purp5
,"PurpFloor5",bv.PurpFloor5
,"Purp6",bv.Purp6
,"PurpFloor6",bv.PurpFloor6
,"Purp7",bv.Purp7
,"PurpFloor7",bv.PurpFloor7
            };
            var parameters=DataParameter.GetSql(args);
            parameters[0].Direction = System.Data.ParameterDirection.InputOutput;
            int res = DbNatam.Instance.ExecuteNonQuery("sp_Building_New", parameters, System.Data.CommandType.StoredProcedure);
            bv.BuildingId = Types.ToInt( parameters[0].Value);
            return res;
        }

        #endregion

        #region static

        public static BuildingView Get(int id)
        {
            using (BuildingContext context = new BuildingContext(id))
            {
                return context.Entity;
            }
        }

        public static IList<BuildingView> GetItems()
        {
            using (BuildingContext context = new BuildingContext())
            {
                return context.EntityList();
            }
        }

        public static IList<Dictionary<string, object>> ViewBuildingToActivate()
        {
            return DbNatam.Instance.QueryDictionary("vw_BuildingView","ActiveState", 0);
        }

        public static string JsonBuildingToActivate()
        {
            return DbNatam.Instance.QueryJson("vw_BuildingNoActiveView");//, "ActiveState", 0);
        }

        public static string GetBuilderView(int BuildingId)
        {
            return DbNatam.Instance.QueryJsonRecord("vw_Building_Wizard_Info", "BuildingId", BuildingId);
        }

        //public static IEnumerable<BuildingView> ViewBuildingToActivate()
        //{
        //    return DbNatam.Instance.EntityItemList<BuildingQueryView>("vw_BuildingView", "ActiveState", 0);
        //}
 
        public static string LookupBuildingName(int BuildingId)
        {
            return DbNatam.Instance.QueryScalar<string>("select BuildingName from Crm_Building where BuildingId=@BuildingId", null, "BuildingId", BuildingId);
        }
        #endregion

        #region query
        /*
        public static IEnumerable<BuildingQueryView> ViewByBuilding(int BuildingId)
        {
            return DbNatam.Instance.ExecuteQuery<BuildingQueryView>("sp_Query_Unit_Building", "QueryType", 4, "IdArg", BuildingId);
        }

        public static IEnumerable<BuildingQueryView> ViewByOwner(int OwnerId)
        {
            return DbNatam.Instance.ExecuteQuery<BuildingQueryView>("sp_Query_Unit_Building", "QueryType", 3, "IdArg", OwnerId);
        }

        public static IEnumerable<BuildingQueryView> ViewByAddress(
            string BuildingName,
            string BuildingStreet,
            string StreetNo,
            string City)
        {
            return DbNatam.Instance.ExecuteQuery<BuildingQueryView>("sp_Query_Unit_Building", "QueryType", 2, "IdArg", 0, "AreaId", null, "DealType", 0, "PurposeType", 0, "SizeMin", 0, "SizeMax", 0, "BuildingName", BuildingName, "BuildingStreet", BuildingStreet, "StreetNo", StreetNo, "City", City);
        }

        public static IEnumerable<BuildingQueryView> ViewByArgs(int QueryType,
           string AreaId,
           int DealType,
           int PurposeType,
           int SizeMin,
           int SizeMax
           )
        {
            return DbNatam.Instance.ExecuteQuery<BuildingQueryView>("sp_Query_Unit_Building", "QueryType", QueryType, "IdArg", 0, "AreaId", AreaId, "DealType", DealType, "PurposeType", PurposeType, "SizeMin", SizeMin, "SizeMax", SizeMax);
        }

        public static IEnumerable<BuildingQueryView> View(
           int QueryType,
           string AreaId,
           int DealType,
           int PurposeType,
           int SizeMin,
           int SizeMax,
           string BuildingName,
           string BuildingStreet,
           string StreetNo,
           string City,
           int OwnerId,
           int BuildingId
           )
        {
            switch (QueryType)
            {
                case 1:
                case 10:
                    return ViewByArgs(QueryType, AreaId, DealType, PurposeType, SizeMin, SizeMax);
                case 2:
                    return ViewByAddress(BuildingName, BuildingStreet, StreetNo, City);
                case 3:
                    return ViewByOwner(OwnerId);
                case 4:
                    return ViewByBuilding(BuildingId);
                default:
                    return null;
            }
        }
         */ 
        #endregion

        #region query server
        public static IEnumerable<BuildingQueryView> ViewByBuilding(int BuildingId, int PageSize, int PageNum, string Sort, string Filter)
        {
            return DbNatam.Instance.ExecuteList<BuildingQueryView>("sp_Query_Unit_Building_v1", "QueryType", 4, "PageSize", PageSize, "PageNum", PageNum, "IdArg", BuildingId, "AreaId", null, "DealType", 0, "PurposeType", 0, "SizeMin", 0, "SizeMax", 0, "BuildingName", null, "BuildingStreet", null, "StreetNo", null, "City", null, "Sort", Sort, "Filter", Filter);
        }

        public static IEnumerable<BuildingQueryView> ViewByOwner(int OwnerId, int PageSize, int PageNum, string Sort, string Filter)
        {
            return DbNatam.Instance.ExecuteList<BuildingQueryView>("sp_Query_Unit_Building_v1", "QueryType", 3, "PageSize", PageSize, "PageNum", PageNum, "IdArg", OwnerId, "AreaId", null, "DealType", 0, "PurposeType", 0, "SizeMin", 0, "SizeMax", 0, "BuildingName", null, "BuildingStreet", null, "StreetNo", null, "City", null, "Sort", Sort, "Filter", Filter);
        }

        public static IEnumerable<BuildingQueryView> ViewByAddress(int PageSize, int PageNum,
            string BuildingName,
            string BuildingStreet,
            string StreetNo,
            string City,
            string Sort,
           string Filter
            )
        {
            return DbNatam.Instance.ExecuteList<BuildingQueryView>("sp_Query_Unit_Building_v1", "QueryType", 2, "PageSize", PageSize, "PageNum", PageNum, "IdArg", 0, "AreaId", null, "DealType", 0, "PurposeType", 0, "SizeMin", 0, "SizeMax", 0, "BuildingName", BuildingName, "BuildingStreet", BuildingStreet, "StreetNo", StreetNo, "City", City, "Sort", Sort, "Filter", Filter);
        }

        public static IEnumerable<BuildingQueryView> ViewByArgs(int QueryType, int PageSize, int PageNum,
           string AreaId,
           int DealType,
           int PurposeType,
           int SizeMin,
           int SizeMax,
            string Sort,
           string Filter
           )
        {
            return DbNatam.Instance.ExecuteList<BuildingQueryView>("sp_Query_Unit_Building_v1", "QueryType", QueryType, "PageSize", PageSize, "PageNum", PageNum, "IdArg", 0, "AreaId", AreaId, "DealType", DealType, "PurposeType", PurposeType, "SizeMin", SizeMin, "SizeMax", SizeMax, "BuildingName", null, "BuildingStreet", null, "StreetNo", null, "City", null, "Sort", Sort, "Filter", Filter);
        }

        public static IEnumerable<BuildingQueryView> View(
           int QueryType,
            int PageSize, int PageNum,
           string AreaId,
           int DealType,
           int PurposeType,
           int SizeMin,
           int SizeMax,
           string BuildingName,
           string BuildingStreet,
           string StreetNo,
           string City,
           int OwnerId,
           int BuildingId,
            string Sort,
           string Filter
           )
        {
            switch (QueryType)
            {
                case 1:
                case 10:
                    return ViewByArgs(QueryType, PageSize, PageNum,AreaId, DealType, PurposeType, SizeMin, SizeMax,Sort,Filter);
                case 2:
                    return ViewByAddress(PageSize, PageNum, BuildingName, BuildingStreet, StreetNo, City,Sort,Filter);
                case 3:
                    return ViewByOwner(OwnerId,PageSize, PageNum,Sort,Filter);
                case 4:
                    return ViewByBuilding(BuildingId, PageSize, PageNum, Sort, Filter);
                default:
                    return null;
            }
        }
        #endregion

    }

    public class BuildingNewView : BuildingView
    {
        //public int Purpose2 { get; set; }
        //public int Purpose3 { get; set; }
        //public int Purpose4 { get; set; }
        //public int Purpose5 { get; set; }
        //public int Purpose6 { get; set; }
        public bool Purp1 { get; set; }
        public bool Purp2 { get; set; }
        public bool Purp3 { get; set; }
        public bool Purp4 { get; set; }
        public bool Purp5 { get; set; }
        public bool Purp6 { get; set; }
        public bool Purp7 { get; set; }
        public int PurpFloor1 { get; set; }
        public int PurpFloor2 { get; set; }
        public int PurpFloor3 { get; set; }
        public int PurpFloor4 { get; set; }
        public int PurpFloor5 { get; set; }
        public int PurpFloor6 { get; set; }
        public int PurpFloor7 { get; set; }
        public int FloorsUp { get; set; }
        public int FloorsDown { get; set; }
        public float FloorSize { get; set; }
        public float FloorSizeUp { get; set; }
        public float FloorSizeDown { get; set; }

        List<int> list = new List<int>();

        public void SetPurposeType(NameValueCollection form)
        {
            string Value = "";
            if (Types.ToBool(form["Purp2"], false))
            { Value += ",2"; }
            if (Types.ToBool(form["Purp3"], false))
            { Value += ",3"; }
            if (Types.ToBool(form["Purp4"], false))
            { Value += ",4";}
            if (Types.ToBool(form["Purp5"], false))
            { Value += ",5"; }
            if (Types.ToBool(form["Purp6"], false))
            { Value += ",6"; }
            if (Types.ToBool(form["Purp7"], false))
            { Value += ",7"; }
            if (Value.Length > 0)
                Value = Value.Substring(1);
            //return Value;
            PurposeType = Value;
        }
    }

    public class BuildingListView : IEntityItem
    {

        public static IEnumerable<BuildingListView> View()
        {
            return DbNatam.Instance.EntityItemList<BuildingListView>(MappingName, null);
        }
        public static IEnumerable<BuildingListView> View(int AreaId)
        {
            return DbNatam.Instance.EntityItemList<BuildingListView>(MappingName, "AreaId", AreaId);
        }
        public static IEnumerable<BuildingListView> ViewBuildingByNatam()
        {
            return DbNatam.Instance.EntityItemList<BuildingListView>("vw_BuildingByNatam", null);
        }
        

        public const string MappingName = "vw_BuildingList";

        [EntityProperty(EntityPropertyType.Identity)]
        public int BuildingId { get; set; }
       
        public string BuildingName { get; set; }
       
        public int AreaId { get; set; }
    }

    public class BuildingView : IEntityItem//EntityItem<DbNatam>, IEntityItem
    {
        #region override

        //public override string GetMappingName()
        //{
        //     return "Crm_Building";
        //}

        //public override EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        //{
        //    EntityValidator validator = new EntityValidator("עדכון בניין", "he");

        //    validator.Required(BuildingName, "שם בניין");
        //    validator.Required(Street, "רחוב");
        //    validator.Required(City, "עיר");
        //    validator.Required(StreetNum, "מס בניין");
        //    return validator;
        //}
        #endregion

        //public static IEnumerable<BuildingView> View()
        //{
        //    return DbNatam.Instance.EntityItemList<BuildingView>(TableName, null);
        //}

        //public static BuildingView View(int BuildingId)
        //{
        //    return DbNatam.Instance.EntityGet<BuildingView>(TableName, BuildingId);
        //}
        //public static BuildingView Current(int BuildingId)
        //{
        //    if (BuildingId > 0)
        //        return View(BuildingId);
        //    return new BuildingView();
        //}

       

        //public int Update(BuildingView b)
        //{
        //    return DbNatam.Instance.UpdateEntity<BuildingView>(MappingName,this,b,b.BuildingId>0? UpdateCommandType.Update: UpdateCommandType.Insert);
        //}
        
        public const string TableName = "Crm_Building";


        [EntityProperty(EntityPropertyType.Identity)]
        public int BuildingId { get; set; }
        [Validator("שם בניין", true, Langs = "en:Building Name|he:שם בניין")]
        public string BuildingName { get; set; }
        [Validator("אזור", true)]
        public int AreaId { get; set; }
        [Validator("רחוב", true)]
        public string Street { get; set; }
        [Validator("מספר בית", true)]
        public string StreetNo { get; set; }
        [Validator("עיר", true)]
        public string City { get; set; }
        public int ZipCode { get; set; }
        public string PurposeType { get; set; }
        public string BuildingClass { get; set; }
        

        //public float BuildingSizeTrade { get; set; }
        //public float BuildingSizeOffice { get; set; }
        //public float BuildingSizeTotal { get; set; }
        //public float BuildingSizeNoParks { get; set; }
        public int ElevatorNo { get; set; }
        public DateTime? BuildingPopulateTime { get; set; }
        public int ManagementCompany { get; set; }
        public int ManagementContact { get; set; }
        public int BuildingOwnerId { get; set; }
        public int FloorNoUp { get; set; }
        public int FloorNoDown { get; set; }
        public int SecurityCompany { get; set; }
        public int ParkingNo { get; set; }
        public int AirConditionType { get; set; }
        public bool Investment { get; set; }
        //public string BuildingAdmin { get; set; }
        //public string BuildingAdminPhone { get; set; }
        //public string BuildingAdminMail { get; set; }
        //public string BuildingAdmin2 { get; set; }
        //public string BuildingAdmin2Phone { get; set; }
        //public string BuildingAdmin2Mail { get; set; }
        public string BuildingGrossNet { get; set; }
        public float OverloadGround { get; set; }
        public float OverloadUp { get; set; }
        public float ManagementFees { get; set; }
        //public float BuildingBasementSize { get; set; }
        public int AgentId { get; set; }
        public string PicPath { get; set; }
        public string Memo { get; set; }
        public int ParkingType { get; set; }
        public int BuildingSteward { get; set; }
        public int FloorDefined { get; set; }
        public int ActiveState { get; set; }
        public float ParkingPrice { get; set; }
        

        //view only
        [EntityProperty(EntityPropertyType.View)]
        public DateTime LastUpdate { get; set; }

        [EntityProperty( EntityPropertyType.View)]
        public string SizeTrade { get; set; }
        [EntityProperty( EntityPropertyType.View)]
        public string SizeOffice { get; set; }
        [EntityProperty( EntityPropertyType.View)]
        public string SizeTotal { get; set; }
        [EntityProperty( EntityPropertyType.View)]
        public string SizeIndustry { get; set; }
        [EntityProperty( EntityPropertyType.View)]
        public string SizeResidence { get; set; }
        [EntityProperty( EntityPropertyType.View)]
        public string SizeWarehouse { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string SizeParking { get; set; }
        [EntityProperty( EntityPropertyType.View)]
        public string SizeFloorUp { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public float AvgPriceForSale { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public float AvgPriceForRent { get; set; }
        [EntityProperty(EntityPropertyType.NA)]
        public bool MailOnChanges { get; set; }

        /*
        AvgPriceForSale
        AvgPriceForRent
        SizeTrade
        SizeOffice
        SizeTotal
        SizeIndustry
        SizeResidence
        SizeWarehouse
        SizeFloorUp
        */

    }

    public class BuildingQueryView : BuildingView, IEntityItem
    {
        /*
        public static IEnumerable<BuildingQueryView> ViewPropertyBuilding(
         int QueryType,
         int IArg,
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
            var parameters = new object[] { "QueryType", QueryType, "IArg", IArg, "AreaId", AreaId, "DealType", DealType, "PurposeType", PurposeType, "SizeMin", SizeMin, "SizeMax", SizeMax, "BuildingName", BuildingName, "BuildingStreet", BuildingStreet, "BuildingNo", BuildingNo };
            return DbNatam.Instance.ExecuteQuery<BuildingQueryView>("sp_Property_Building_Query", parameters);
        }

        public static IEnumerable<BuildingQueryView> View(
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
            var parameters = new object[] { "QueryType", QueryType, "AreaId", AreaId, "DealType", DealType, "PurposeType", PurposeType, "SizeMin", SizeMin, "SizeMax", SizeMax, "BuildingName", BuildingName, "BuildingStreet", BuildingStreet, "BuildingNo", BuildingNo };
            return DbNatam.Instance.ExecuteQuery<BuildingQueryView>("sp_Building_Query", parameters);//, System.Data.CommandType.StoredProcedure);
        }
        */
        public int TotalRows { get; set; }
        public string OwnerName { get; set; }
       
        public string ManagementName { get; set; }

    }

    public class BuildingInfoView : IEntityItem
    {
        const string TableName = "vw_BuildingInfo";

        //public static BuildingInfoView View(int BuildingId)
        //{
        //    var parameters = new object[] { "BuildingId", BuildingId};
        //    var model = DbNatam.Instance.QuerySingle<BuildingInfoView>("select * from " + TableName + " where BuildingId=@BuildingId", parameters);
        //    if (model != null)
        //    {
        //        model.FloorNum = 0;
        //        model.PropertyType = 1;
        //    }
        //    return model;
        //}

        //public static BuildingInfoView View(int BuildingId, int FloorNum)
        //{
        //    var parameters = new object[] { "BuildingId", BuildingId };
        //    var model = DbNatam.Instance.QuerySingle<BuildingInfoView>("select * from " + TableName + " where BuildingId=@BuildingId", parameters);
        //    if (model != null)
        //    {
        //        model.FloorNum = FloorNum;
        //        model.PropertyType = 0;
        //    }
        //    return model;
        //}


        public static BuildingInfoView View(int BuildingId, int FloorNum, int PropertyType)
        {
            BuildingInfoView model = DbNatam.Instance.ExecuteSingle<BuildingInfoView>("sp_BuildingFloorInfo", "BuildingId", BuildingId, "FloorNum", FloorNum, "PropertyType", PropertyType);

            //if (PropertyType == 0)
            //{
            //    model = DbNatam.Instance.ExecuteSingle<BuildingInfoView>("sp_BuildingFloorInfo", "BuildingId", BuildingId, "FloorNum", FloorNum, "PropertyType", PropertyType);
            //}
            //else
            //{
            //    model = new BuildingInfoView()
            //    {
            //        BuildingId = BuildingId,
            //        BuildingName = BuildingContext.LookupBuildingName(BuildingId),
            //        FloorNum = FloorNum,
            //        PropertyType = PropertyType
            //    };
            //}
            return model;
        }

        public static BuildingInfoView ViewByUnit(int UnitId)
        {
            BuildingInfoView model = DbNatam.Instance.ExecuteSingle<BuildingInfoView>("sp_BuildingUnitInfo", "UnitId", UnitId);

            return model;
        }


        [EntityProperty(EntityPropertyType.Identity)]
        public int BuildingId { get; set; }
       
        public string BuildingName { get; set; }

        public int OwnerId { get; set; }
        public string Address { get; set; }

        public int SumFloorArea { get; set; }
        public int SumFloorPopulate { get; set; }
        public int SumFloorFree { get; set; }
        public int SumFloorRemain { get; set; }

        //[EntityProperty(EntityPropertyType.NA)]
        public int FloorNum { get; private set; }
        //[EntityProperty(EntityPropertyType.NA)]
        public int PropertyType { get; private set; }

    }
}
