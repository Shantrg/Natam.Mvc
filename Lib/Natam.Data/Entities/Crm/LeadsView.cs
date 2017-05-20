using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;
using Nistec;
using Nistec.Serialization;
using Nistec.Web;
using System.Data;
using Nistec.Generic;

namespace Pro.Data.Entities
{

    [Entity(EntityName = "LeadsView", MappingName = "Crm_Leads", ConnectionKey = "cnn_natam", EntityKey = new string[] { "LeadId" })]
    public class LeadsContext : EntityContext<LeadsView>
    {
        #region ctor

        public LeadsContext()
        {
        }

        public LeadsContext(int LeadId)
            : base(LeadId)
        {
        }
        #endregion

        #region update

        public static int DoSave(LeadsView v)
        {

            EntityValidator.Validate(v, "לקוח", "he");

            var args=new object[]{
            "LeadId",v.LeadId
            ,"AgentId",v.AgentId
            ,"CustomerName",v.CustomerName
            ,"Phone",v.Phone
            ,"Commission",v.Commission
            ,"PurposeType",v.PurposeType
            ,"DealType",v.DealType
            ,"RequestSize",v.RequestSize
            ,"AreaType",v.AreaType
            ,"BadgetForMr",v.BadgetForMr
            ,"EntryDate",v.EntryDate
            ,"ParkingNum",v.ParkingNum
            ,"ContractDuration",v.ContractDuration
            ,"Status",v.Status
            ,"ContractCopy",v.ContractCopy
            ,"Memo",v.Memo
            ,"Address",v.Address
            ,"City",v.City
            ,"Fax",v.Fax
            ,"Phone2",v.Phone2
            ,"UploadKey",v.UploadKey
            };
            var parameters=DataParameter.GetSql(args);
            parameters[0].Direction = System.Data.ParameterDirection.InputOutput;
            int res= DbNatam.Instance.ExecuteNonQuery("sp_Leads_Update", parameters, System.Data.CommandType.StoredProcedure );
            v.LeadId = Types.ToInt( parameters[0].Value);
            return res;
        }

        public static int DoDelete(int LeadId, int UserId)
        {
 
            var parameters = DataParameter.GetSqlList("LeadId",LeadId,"UserId",UserId);
            DataParameter.AddOutputParameter(parameters, "Status", System.Data.SqlDbType.Int, 4);
            int res = DbNatam.Instance.ExecuteNonQuery("sp_Leads_Delete", parameters.ToArray(), System.Data.CommandType.StoredProcedure);
            var status = Types.ToInt(parameters[2].Value);
            return status;
        }

        public static int DoLeadsPropertyAction(int LeadId, int UnitId, string action)
        {
            var parameters = DataParameter.GetSqlList("LeadId", LeadId, "UnitId", UnitId,"Action",action);
            //DataParameter.AddOutputParameter(parameters, "Status", System.Data.SqlDbType.Int, 4);
            int res = DbNatam.Instance.ExecuteNonQuery("sp_Leads_Property_Action", parameters.ToArray(), System.Data.CommandType.StoredProcedure);
            //var status = Types.ToInt(parameters[2].Value);
            return res;
        }

        #endregion

        #region static
        public static IEnumerable<LeadsView> View()
        {
            return DbNatam.Instance.EntityItemList<LeadsView>("Crm_Leads", null);
        }
        public static LeadsView View(int LeadId)
        {
            return DbNatam.Instance.EntityItemGet<LeadsView>("Crm_Leads", "LeadId", LeadId);
        }
        public static string Validate_CustomerName(string customerName, int userId)
        {
            string result = "";
            var parameters = DataParameter.GetSqlList("ValidateType", 1, "CustomerName", customerName, "AgentId", userId);
            DataParameter.AddOutputParameter(parameters, "Result", System.Data.SqlDbType.NVarChar, 4000);
            //parameters[0].Direction = System.Data.ParameterDirection.InputOutput;
            int res = DbNatam.Instance.ExecuteNonQuery("sp_Leads_Validity", parameters.ToArray(), System.Data.CommandType.StoredProcedure);
            result = Types.NZ(parameters[3].Value, "");
            if (result == "ok" || result == "none" || result == "")
                return "ok";
            //Dictionary<string, string> dic = new Dictionary<string, string>();
            //var dic = JsonSerializer.ToDictionary("{" + result + "}");

            object[] args = GenericRecord.StringToKeyValue(result, ',', ':');
            GenericRecord dic = GenericRecord.ParseKeyValue(args);


            string message = string.Format("הלקוח נרשם ע\"י {0} בתאריך {1} , עדכון אחרון בתאריך {2} במערכת.", dic["Agent"], dic["Created"], dic["Updated"]);

            return message;
        }

        public static int Leads_Transfer(int LeadId, int AgentId)
        {
            var parameters = DataParameter.GetSqlList("LeadId", LeadId, "AgentId", AgentId);
            DataParameter.AddOutputParameter(parameters, "NewId", System.Data.SqlDbType.Int, 4);
            int res = DbNatam.Instance.ExecuteNonQuery("sp_Leads_Transfer", parameters.ToArray(), System.Data.CommandType.StoredProcedure);
            int newid = Types.ToInt(parameters[2].Value, 0);

            return newid;

            //if (newid > 0)
            //    return "הלקוח כולל כל הפרטים הנלווים הועברו";
            //if (newid == -1)
            //    return "נתונים שגויים, פרטי הסוכן המיועד אינם תקינים";
            //if (newid == -2)
            //    return "נתונים שגויים, הלקוח או הסוכן המיועד אינם תקינים";
            //else
            //    return "אירעה שגיאה, הנתונים לא הועברו";

        }


        public static IEnumerable<LeadsView> ViewByQuery(int QueryType, int AgentId, string CustomerName, string ContactName, string DealType, string PurposeType, string AreaType, int RequestSize)
        {
            return DbNatam.Instance.ExecuteList<LeadsView>("sp_Leads_Query", "QueryType", QueryType, "AgentId", AgentId, "CustomerName", CustomerName, "ContactName", ContactName, "DealType", DealType, "PurposeType", PurposeType, "AreaType", AreaType, "RequestSize", RequestSize);
        }
        public static DataTable ExportByQuery(int QueryType, int AgentId, string CustomerName, string ContactName, string DealType, string PurposeType, string AreaType, int RequestSize)
        {
            var parameters = DataParameter.GetSql("QueryType", QueryType, "AgentId", AgentId, "CustomerName", CustomerName, "ContactName", ContactName, "DealType", DealType, "PurposeType", PurposeType, "AreaType", AreaType,"RequestSize",RequestSize, "ReportType", 1);
            return DbNatam.Instance.ExecuteCommand<DataTable>("sp_Leads_Query", parameters, CommandType.StoredProcedure);
        }
         public static IEnumerable<LeadPropertyItem> ViewLeadsPropertyList(int LeadId)
        {
            return DbNatam.Instance.ExecuteList<LeadPropertyItem>("sp_Leads_List", "LeadId", LeadId);
        }
         public static IEnumerable<LeadPropertyItem> ViewLeads4TransPropertyList(int LeadId)
         {
             return DbNatam.Instance.ExecuteList<LeadPropertyItem>("sp_Leads_List", "LeadId", LeadId, "Action", "4trans");
         }
         public static string ViewLeads4UnitJson(int AgentId, int UnitId)
         {
             return DbNatam.Instance.ExecuteJson("sp_Leads_List_4Trans", "AgentId", AgentId, "UnitId", UnitId);
         }
         public static int LeadsPropertyListAdd(int LeadId, string Units)
         {
             return DbNatam.Instance.ExecuteNonQuery("sp_Leads_List_Add", "LeadId", LeadId, "Units", Units);
         }
          public static int LeadsPropertyListUpdate(int LeadId, int UnitId, string Comment)
         {
             return DbNatam.Instance.ExecuteNonQuery("sp_Leads_List_Update", "LeadId", LeadId, "UnitId", UnitId,"Comment",Comment);
         }

        

        #endregion
    }

    //public class LeadsListView : LeadsView
    //{

    //    public static IEnumerable<LeadsListView> ViewByAgent(int AgentId)
    //    {
    //        return DbNatam.Instance.EntityItemList<LeadsListView>("vw_Leads", "AgentId", AgentId);
    //    }

        
    //    public string PurposeName { get; set; }
        
    //    public string DealName { get; set; }
        
    //    public string AreaName { get; set; }
    //}

    public class LeadsView : IEntityItem//EntityItem<DbNatam>, IEntityItem
    {
        #region override

        //public override string MappingName()
        //{
        //    return "Crm_Leads";
        //}
 
        //public override EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        //{
        //    EntityValidator validator = new EntityValidator("הלקוחות שלי", "he");
        //    validator.Required(CustomerName, "שם לקוח");
        //    return validator;
        //}
        #endregion


        //public static IEnumerable<LeadsView> View()
        //{
        //    return DbNatam.Instance.EntityItemList<LeadsView>(TableName, null);
        //}
        //public static LeadsView View(int LeadId)
        //{
        //    return DbNatam.Instance.EntityItemGet<LeadsView>(TableName,"LeadId", LeadId);
        //}

        
        

        //public const string TableName = "Crm_Leads";


        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int LeadId { get; set; }
        
        //public int ActionType { get; set; }
        
        
        public DateTime Creation { get; set; }
        
        public DateTime LastUpdate { get; set; }

        
        [Validator("שם לקוח", true)]
        public string CustomerName { get; set; }
        
        //public string Email { get; set; }
        
        //[Validator("טלפון נייד", true)]
        //public string Mobile { get; set; }
        
        public string Phone { get; set; }
        public string Phone2 { get; set; }
        
        public string Commission { get; set; }

        public string PurposeType { get; set; }

        public string DealType { get; set; }
        
        public string RequestSize { get; set; }

        public string AreaType { get; set; }
        
        public DateTime? EntryDate { get; set; }
        
        public int ParkingNum { get; set; }
        
        public int ContractDuration { get; set; }
        
        public int BadgetForMr { get; set; }
        
        public int Status { get; set; }
        
        public int AgentId { get; set; }
        
        public string ContractCopy { get; set; }
        
        public string Memo { get; set; }
        
        public string Address { get; set; }

        public string City { get; set; }

        public string Fax { get; set; }

        [EntityProperty(EntityPropertyType.NA)]
        public string UploadKey { get; set; }

        public int TransId { get; set; }

        #endregion

        //public static int DoSave(int leadId, LeadsView view)
        //{
        //    if (leadId > 0)
        //    {
        //        var entity = LeadsView.View(leadId);
        //        return entity.DoUpdate<LeadsView>(view);
        //    }
        //    else
        //        return view.DoInsert<LeadsView>();
        //}
    }

}
