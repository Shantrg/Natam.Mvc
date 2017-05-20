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

    [Entity(EntityName = "UnitView", MappingName = "Crm_Building_Units", ConnectionKey = "cnn_natam", EntityKey = new string[] { "UnitId" })]
    public class UnitContext : EntityContext<UnitView>
    {
        #region ctor

        public UnitContext()
        {
        }

        public UnitContext(int UnitId)
            : base(UnitId)
        {
        }

        #endregion

        #region update

        public static int DoSave(UnitView v)
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
            };
            var parameters = DataParameter.GetSql(args);
            parameters[0].Direction = System.Data.ParameterDirection.InputOutput;
            parameters[1].Direction = System.Data.ParameterDirection.InputOutput;
            //int res = DbNatam.Instance.ExecuteNonQuery("sp_Unit_Save", parameters, System.Data.CommandType.StoredProcedure);
            int res = DbNatam.Instance.ExecuteNonQuery("sp_Unit_Save", parameters, System.Data.CommandType.StoredProcedure);
            v.UnitId = Types.ToInt(parameters[0].Value);
            var status = Types.ToInt(parameters[1].Value);
            return status;
 
        }


/*
        public static int DoSave(int id, UnitView bv, UpdateCommandType commandType)
        {
            if (commandType == UpdateCommandType.Delete)
                using (UnitContext context = new UnitContext(id))
                {
                    return context.SaveChanges(commandType);
                }

            EntityValidator.Validate(bv, "נכס", "he");

            if (commandType == UpdateCommandType.Insert)
                using (UnitContext context = new UnitContext())
                {
                    context.Set(bv);
                    return context.SaveChanges(commandType);
                }

            if (commandType == UpdateCommandType.Update)
                using (UnitContext context = new UnitContext(id))
                {
                    context.Set(bv);
                    return context.SaveChanges(commandType);
                }
            return 0;
        }

        public static int DoSave(UnitView bv)
        {
            EntityValidator.Validate(bv, "נכס", "he");
            
            using (UnitContext context = new UnitContext())
            {
                UpdateCommandType cmdtype = UpdateCommandType.Insert;
                if (bv.UnitId > 0)
                {
                    context.SetEntity(bv.UnitId);
                    cmdtype = UpdateCommandType.Update;
                }
                context.Set(bv);
                return context.SaveChanges(cmdtype);
            }
        }
*/
        public static int DoSavePic(int id, string field, string filename)
        {
            return DbNatam.Instance.ExecuteCommand("update Crm_Building_Units set " + field + "=@" + field + " where UnitId=@UnitId", System.Data.CommandType.Text, field, filename, "UnitId", id);
            //return DbNatam.Instance.ExecuteCommand("update Crm_Building_Units set " + field + "=@" + field + " where UnitId=@UnitId", System.Data.CommandType.Text, field, filename, "UnitId", id);
        }

        public static int DoDelete(int UnitId, int UserId)
        {

            var parameters = DataParameter.GetSqlList("UnitId",UnitId,"UserId",UserId);
            DataParameter.AddOutputParameter(parameters, "Status", System.Data.SqlDbType.Int, 4);
            int res = DbNatam.Instance.ExecuteNonQuery("sp_Unit_Delete", parameters.ToArray(), System.Data.CommandType.StoredProcedure);
            var status = Types.ToInt(parameters[2].Value);
            return status;
        }

        #endregion

        #region static

        public static UnitView Get(int id)
        {
            using (UnitContext context = new UnitContext(id))
            {
                return context.Entity;
            }
        }

        public static int Lookup_OwnerId(int UnitId)
        {
            return DbNatam.Instance.QueryScalar<int>("select OwnerId from Crm_Building_Units where UnitId=@UnitId", 0, "UnitId", UnitId);
        }

        public static int Lookup_BuildingId(int UnitId)
        {
            return DbNatam.Instance.QueryScalar<int>("select BuildingId from Crm_Building_Units where UnitId=@UnitId", 0, "UnitId", UnitId);
        }

        public static IEnumerable<UnitView> View(int BuildingId)
        {
            using (UnitContext context = new UnitContext())
            {
                return context.EntityList(DataFilter.GetSql("BuildingId=@BuildingId", BuildingId));
            }
        }

        public static IEnumerable<UnitInfoView> ViewByBuilding(int BuildingId, int FloorNum, int PropertyType)
        {
            if (PropertyType == 1)
                return DbNatam.Instance.ExecuteList<UnitInfoView>("sp_Query_Unit", "BuildingId", BuildingId);
            return DbNatam.Instance.ExecuteList<UnitInfoView>("sp_Query_Unit", "BuildingId", BuildingId, "FloorNum", FloorNum);

        }

        #endregion

        #region query
        /*
        public static IEnumerable<UnitGridView> ViewByBuilding(int BuildingId)
        {
            return DbNatam.Instance.ExecuteQuery<UnitGridView>("sp_Query_BuildingUnit", "QueryType", 4, "IdArg", BuildingId);
        }

        public static IEnumerable<UnitGridView> ViewByOwner(int OwnerId)
        {
            return DbNatam.Instance.ExecuteQuery<UnitGridView>("sp_Query_BuildingUnit", "QueryType", 3, "IdArg", OwnerId);
        }

        public static IEnumerable<UnitGridView> ViewByAddress(
            string BuildingName,
            string BuildingStreet,
            string StreetNo,
            string City)
        {
            return DbNatam.Instance.ExecuteQuery<UnitGridView>("sp_Query_BuildingUnit", "QueryType", 2, "IdArg", 0, "AreaId", null, "DealType", 0, "PurposeType", 0, "SizeMin", 0, "SizeMax", 0, "BuildingName", BuildingName, "BuildingStreet", BuildingStreet, "StreetNo", StreetNo, "City", City);
        }

        public static IEnumerable<UnitGridView> ViewByArgs(
           string AreaId,
           int DealType,
           int PurposeType,
           int SizeMin,
           int SizeMax
           )
        {
            return DbNatam.Instance.ExecuteQuery<UnitGridView>("sp_Query_BuildingUnit", "QueryType", 1, "IdArg", 0, "AreaId", AreaId, "DealType", DealType, "PurposeType", PurposeType, "SizeMin", SizeMin, "SizeMax", SizeMax);
        }

        public static IEnumerable<UnitGridView> QueryView(
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
                    return ViewByArgs(AreaId, DealType, PurposeType, SizeMin, SizeMax);
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

        public static IEnumerable<UnitGridView> ViewByBuilding(int BuildingId, int PageSize, int PageNum, string Sort, string Filter)
        {
            return DbNatam.Instance.ExecuteList<UnitGridView>("sp_Query_BuildingUnit_v1", "QueryType", 4, "PageSize", PageSize, "PageNum", PageNum, "IdArg", BuildingId, "AreaId", null, "DealType", 0, "PurposeType", 0, "SizeMin", 0, "SizeMax", 0, "BuildingName", null, "BuildingStreet", null, "StreetNo", null, "City", null, "Sort", Sort, "Filter", Filter);
        }

        public static IEnumerable<UnitGridView> ViewByOwner(int OwnerId, int PageSize, int PageNum, string Sort, string Filter)
        {
            return DbNatam.Instance.ExecuteList<UnitGridView>("sp_Query_BuildingUnit_v1", "QueryType", 3, "PageSize", PageSize, "PageNum", PageNum, "IdArg", OwnerId, "AreaId", null, "DealType", 0, "PurposeType", 0, "SizeMin", 0, "SizeMax", 0, "BuildingName", null, "BuildingStreet", null, "StreetNo", null, "City", null, "Sort", Sort, "Filter", Filter);
        }
         
        public static IEnumerable<UnitGridView> ViewByAddress( int PageSize, int PageNum,
            string BuildingName,
            string BuildingStreet,
            string StreetNo,
            string City,
            string Sort,
            string Filter)
        {
            return DbNatam.Instance.ExecuteList<UnitGridView>("sp_Query_BuildingUnit_v1", "QueryType", 2, "PageSize", PageSize, "PageNum", PageNum, "IdArg", 0, "AreaId", null, "DealType", 0, "PurposeType", 0, "SizeMin", 0, "SizeMax", 0, "BuildingName", BuildingName, "BuildingStreet", BuildingStreet, "StreetNo", StreetNo, "City", City, "Sort", Sort, "Filter", Filter);
        }

        public static IEnumerable<UnitGridView> ViewByArgs(int PageSize, int PageNum,
           string AreaId,
           int DealType,
           int PurposeType,
           int SizeMin,
           int SizeMax,
           string Sort,
           string Filter
           )
        {
            return DbNatam.Instance.ExecuteList<UnitGridView>("sp_Query_BuildingUnit_v1", "QueryType", 1, "PageSize", PageSize, "PageNum", PageNum, "IdArg", 0, "AreaId", AreaId, "DealType", DealType, "PurposeType", PurposeType, "SizeMin", SizeMin, "SizeMax", SizeMax, "Sort", Sort, "Filter", Filter);
        }

        public static IEnumerable<UnitGridView> QueryView(
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
                    return ViewByArgs(PageSize, PageNum,AreaId, DealType, PurposeType, SizeMin, SizeMax,Sort,Filter);
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
   

    public class UnitBuildingInfoView : UnitView
    {
        public static UnitBuildingInfoView ViewUnitBuildingInfo(int UnitId)
        {
            return DbNatam.Instance.EntityItemGet<UnitBuildingInfoView>("vw_UnitInfo", "UnitId", UnitId);
        }

        
        public string BuildingName { get; set; }
        
        public string Address { get; set; }
        
        public string City { get; set; }
    }
    public class UnitInfoView : UnitView
    {
        
        public string UserName { get; set; }
        
        public string OwnerName { get; set; }
        
        public string PurposeName { get; set; }
        
        public string DealName { get; set; }
       
    }
    public class UnitGridView : UnitView
    {
        public int TotalRows { get; set; }
        public string BuildingName { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string UserName { get; set; }

        public string OwnerName { get; set; }

        public string PurposeName { get; set; }

        public string DealName { get; set; }
        public string PropertyTypeName { get; set; }

    }
    public class UnitView : IEntityItem
    {


        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int UnitId { get; set; }
        
        [Validator("קוד בניין", true)]
        public int BuildingId { get; set; }
        public int FloorNum { get; set; }
        public int UnitNum { get; set; }
        public int UnitSize { get; set; }
        public string UnitDescription { get; set; }
        public int DealType { get; set; }       
        public int PurposeId { get; set; }
        public bool Populate { get; set; }
        public float Price { get; set; }
        public int OwnerId { get; set; }
        public int TenantId { get; set; }
 
   
        //
        //public int DealId { get; set; }

        public DateTime? DateEndContract { get; set; }
        public DateTime? DateEndOption1 { get; set; }
        public DateTime? DateEndOption2 { get; set; }

        public DateTime LastUpdate { get; set; }
        public string Memo { get; set; }
        public int AgentId { get; set; }
        public int PropertyType { get; set; }

        //[EntityProperty(EntityPropertyType.View)]
        //public float FreeFloorSize { get; set; }

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
 
}
