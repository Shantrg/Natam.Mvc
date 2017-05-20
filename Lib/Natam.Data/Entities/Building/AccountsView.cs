using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;
using Nistec;
using System.Data;
using Pro.Data.Entities;
using Pro.Models;

namespace Pro.Data.Entities
{

    [Entity(EntityName = "AccountView", MappingName = "Crm_Accounts", ConnectionKey = "cnn_natam", EntityKey = new string[] { "AccountId" })]
    public class AccountContext : EntityContext<AccountView>
    {
        #region ctor

        public AccountContext()
        {
        }

        public AccountContext(int AccountId)
            : base(AccountId)
        {
        }
        #endregion

        #region update

        public static int DoSave(int id, string UploadKey, AccountView entity)
        {
            return DoSave(id, UploadKey,entity, id > 0 ? UpdateCommandType.Update : UpdateCommandType.Insert);
        }

        public static int DoSave(int id, string UploadKey, AccountView entity, UpdateCommandType commandType)
        {
            if (commandType == UpdateCommandType.Delete)
                using (AccountContext context = new AccountContext(id))
                {
                    return context.SaveChanges(commandType);
                }

            EntityValidator.Validate(entity, "לקוח", "he");

            if (commandType == UpdateCommandType.Insert)
            {
                entity.Creation = DateTime.Now;
                int res = 0;
                using (AccountContext context = new AccountContext())
                {
                    context.Set(entity);
                    res= context.SaveChanges(commandType);
                    if(res>0 && UploadKey !=null)
                    {
                        context.ExecuteNonQuery("sp_Contact_Update_Key", DataParameter.GetSql("AccountId", id, "UploadKey", UploadKey), CommandType.StoredProcedure);
                    }
                    return res;
                }
            }
            if (commandType == UpdateCommandType.Update)
                using (AccountContext context = new AccountContext(id))
                {
                    context.Set(entity);
                    return context.SaveChanges(commandType);
                }
            return 0;
        }

        public static int DoDelete(int id)
        {
            using (AccountContext context = new AccountContext())
            {
                return context.ExecuteNonQuery("sp_Account_Delete", DataParameter.GetSql("AccountId", id, "Replacement", 0), CommandType.StoredProcedure);
            }
        }

        public static int DoSaveNew(AccountContactView v)
        {

            var args = new object[]{

                "AccountId", v.AccountId
                ,"AccountName", v.AccountName
                ,"AccountType", v.AccountType
                ,"CompanyName", v.CompanyName
                ,"Address", v.Address
                ,"City", v.City
                ,"ZipCode", v.ZipCode
                ,"Phone1", v.Phone1
                ,"Phone2", v.Phone2
                ,"Phone3", v.Phone3
                //,"Email", null//v.Email
                ,"Fax", v.Fax
                //,"WebSite", v.WebSite
                ,"Details", v.Details
                //,"OldId", v.OldId
                //,"Mobile", null//v.Mobile
                //,"Segments", v.Segments
                ,"AgentId", v.AgentId
                ,"AccountCategory", v.AccountCategory
                ,"ContactName", v.ContactName
                ,"ContactTitle", v.ContactTitle
                ,"ContactEmail", v.ContactEmail
                ,"ContactMobile", v.ContactMobile
                ,"ContactPhone1", v.ContactPhone1
                //,"ContactPhone2", v.ContactPhone2
                //,"ContactPhone3", v.ContactPhone3
                ,"ContactDetails", v.ContactDetails
                ,"ContactRole", v.ContactRole

            };
            var parameters = DataParameter.GetSql(args);
            parameters[0].Direction = System.Data.ParameterDirection.InputOutput;
            //parameters[1].Direction = System.Data.ParameterDirection.InputOutput;
            //int res = DbNatam.Instance.ExecuteNonQuery("sp_Unit_Save", parameters, System.Data.CommandType.StoredProcedure);
            int res = DbNatam.Instance.ExecuteNonQuery("sp_Accounts_AddNew", parameters, System.Data.CommandType.StoredProcedure);
            v.AccountId = Types.ToInt(parameters[0].Value);
            //var status = Types.ToInt(parameters[1].Value);
            return v.AccountId > 0 ? 1 : 0;
        }

        public static ResultInfo ValidateNewAccount(int AccountType,string AccountName, string ContactName, string CellPhone)
        {

            var args = new object[]{

                "AccountType",  AccountType
                ,"AccountName", AccountName
                ,"ContactName", ContactName
                ,"Mobile", CellPhone
                ,"AccountId", 0
            };
            var parameters = DataParameter.GetSql(args);
            parameters[4].Direction = System.Data.ParameterDirection.InputOutput;
            int res = DbNatam.Instance.ExecuteNonQuery("sp_Account_Validity", parameters, System.Data.CommandType.StoredProcedure);
            int accountId = parameters.GetParameterValue<int>("AccountId");
            return new ResultInfo()
            {
                OutputId = accountId,
                Status = accountId>0?1:0,
                Message = "קיים חשבון עם  פרטים זהים במערכת",
                Title = "",
                Link = "<a href=\"javascript:app_accounts.accountDisplay("+accountId+",'');\">הצג</a>"
            };
        }

        #endregion

        #region static

        public static AccountView Get(int id)
        {
            using (AccountContext context = new AccountContext(id))
            {
                return context.Entity;
            }
        }

        public static IList<AccountView> GetItems()
        {
            using (AccountContext context = new AccountContext())
            {
                return context.EntityList();
            }
        }

        public static string LookupAccountName(int accountId)
        {
            return DbNatam.Instance.QueryScalar<string>("select AccountName from Crm_Accounts where AccountId=@AccountId","", "AccountId", accountId);
        }
        public static string LookupAgentName(int userId)
        {
            return DbNatam.Instance.QueryScalar<string>("select DisplayName from web_UserProfile where UserId=@UserId", "", "UserId", userId);
        }

        public static string GetAgentListJson(int currentUser)
        {
            return DbNatam.Instance.QueryJson("SELECT [UserId],[DisplayName] FROM [webvw_UserProfile] where [UserRole]>=1 and UserId<>@UsertId", "UsertId", currentUser);
        }

        public static string AccountTypeStr(AccountTypes type)
        {

            switch (type)
            {
                case AccountTypes.Unknown:// = 0,    //0 
                    return "לא ידוע";
                case AccountTypes.Customer:// = 1,   //1	
                    return "לקוח";
                case AccountTypes.Owner:// = 2,   //2	
                    return "בעלים";
                case AccountTypes.Investor:// = 3,   //3	
                    return "משקיע";
                case AccountTypes.Tenant:// = 4,   //4	
                    return "דייר";
                case AccountTypes.Profession:// = 5,   //5	
                    return "בעל מקצוע";
                case AccountTypes.Management:// = 6,  //6	
                    return "חברת ניהול";
                case AccountTypes.Lead:// = 7//
                    return "לקוח סןכן";
                default:
                    return "לא ידוע";
            }
        }

        public static IEnumerable<AccountView> View()
        {
            return DbNatam.Instance.EntityItemList<AccountView>(MappingName, null);
        }
        public static IEnumerable<AccountView> ViewByType(int AccountType)
        {
            return DbNatam.Instance.EntityItemList<AccountView>(MappingName, "AccountType", AccountType);
        }
        public static IEnumerable<AccountView> ViewByQuery(int QueryType, string AccountName, string ContactName, int AccType)
        {
            return DbNatam.Instance.ExecuteList<AccountView>("sp_Account_Query", "QueryType", QueryType, "AccountName", AccountName, "ContactName", ContactName, "AccType", AccType);
        }
        public static IEnumerable<AccountView> ViewByQuery(int QueryType, string NewsType, string CustomerName, string ContactName, int AccType)
        {
            return DbNatam.Instance.ExecuteList<AccountView>("sp_Customer_Query", "QueryType", QueryType, "NewsType", NewsType, "CustomerName", CustomerName, "ContactName", ContactName, "AccType", AccType);
        }
        public static DataTable ExportByQuery(int QueryType, string NewsType, string CustomerName, string ContactName, int AccType)
        {
            var parameters = DataParameter.GetSql("QueryType", QueryType, "NewsType", NewsType, "CustomerName", CustomerName, "ContactName", ContactName, "AccType", AccType, "ReportType", 1);
            return DbNatam.Instance.ExecuteCommand<DataTable>("sp_Customer_Query", parameters, CommandType.StoredProcedure);
        }

        public static IEnumerable<AccountContactFilter> ViewByFilter(string AccountName, string ContactName, string ContactMobile, int AccType)
        {
            return DbNatam.Instance.ExecuteList<AccountContactFilter>("sp_Account_Filter", "AccountName", AccountName, "ContactName", ContactName, "ContactMobile", ContactMobile, "AccType", AccType);
        }




        //public static AccountView Get(int AccountId)
        //{
        //    if (AccountId == 0)
        //        return new AccountView();
        //    return DbNatam.Instance.EntityItemGet<AccountView>(MappingName, "AccountId", AccountId);
        //}
        public const string MappingName = "Crm_Accounts";

        #endregion
    }


    public class AccountListView : IEntityItem
    {

        public static IEnumerable<AccountListView> View()
        {
            return DbNatam.Instance.EntityItemList<AccountListView>(MappingName, null);
        }

        public static IEnumerable<AccountListView> ViewOwners()
        {
            return DbNatam.Instance.EntityItemList<AccountListView>(MappingName, "AccountType", 2);
        }
        public static IEnumerable<AccountListView> ViewTenants()
        {
            return DbNatam.Instance.EntityItemList<AccountListView>(MappingName, "AccountType", 4);
        }
        public static IEnumerable<AccountListView> ViewManagements()
        {
            return DbNatam.Instance.EntityItemList<AccountListView>(MappingName, "AccountType", 6);
        }

        public static AccountListView Get(int AccountId)
        {
            return DbNatam.Instance.EntityItemGet<AccountListView>(MappingName, "AccountId", AccountId);
        }

        public const string MappingName = "vw_AccountsList";


        [EntityProperty(EntityPropertyType.Identity)]
        public int AccountId { get; set; }
        
        public string AccountName { get; set; }
        
        public int AccountType { get; set; }
        
        public string ContactView { get; set; }

    }

    public class AccountContactFilter : IEntityItem
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; }

        public int AccountType { get; set; }
        public string CompanyName { get; set; }
        public string Phone1 { get; set; }

        public int ContactId { get; set; }
        public string ContactName { get; set; }
        public string ContactMobile { get; set; }
        public string ContactEmail { get; set; }
        public int Role { get; set; }
    }

    public class AccountContactView : AccountView
    {
//@AccountId int output
//,@AccountName nvarchar(50)
//,@AccountType tinyint
//,@CompanyName nvarchar(50)
//,@Address nvarchar(50)
//,@City nvarchar(50)
//,@ZipCode varchar(10)
//,@Phone1 varchar(20)
//,@Phone2 varchar(20)
//,@Phone3 varchar(20)
//,@Fax varchar(20)
//,@Details nvarchar(max)
//,@AgentId int
//,@AccountCategory tinyint

        public string ContactName { get; set; }
        public string ContactTitle { get; set; }

        [EntityProperty(Caption = "טלפון נייד")]
        public string ContactMobile { get; set; }
        [EntityProperty(Caption = "טלפון 1")]
        public string ContactPhone1 { get; set; }
        //[EntityProperty(Caption = "טלפון 2")]
        //public string ContactPhone2 { get; set; }

        //public string ContactPhone3 { get; set; }

        [EntityProperty(Caption = "דואל")]
        public string ContactEmail { get; set; }

        public string ContactDetails { get; set; }

        public string ContactRole { get; set; }
    }

    public class AccountView : IEntityItem
    {

        [EntityProperty(EntityPropertyType.Identity)]
        public int AccountId { get; set; }
        [EntityProperty(Caption="שם")]
        public string AccountName { get; set; }
        
        public int AccountType { get; set; }
        
        public int AccountCategory { get; set; }
        [EntityProperty(Caption = "שם חברה")]
        public string CompanyName { get; set; }
      
        
        public string Address { get; set; }
        
        public string City { get; set; }
        
        public string ZipCode { get; set; }
        [EntityProperty(Caption = "טלפון 1")]
        public string Phone1 { get; set; }
        [EntityProperty(Caption = "טלפון 2")]
        public string Phone2 { get; set; }
        
        public string Phone3 { get; set; }

        #region contact
        [EntityProperty(Caption = "איש קשר")]
        public string ContactName { get; set; }
        [EntityProperty(Caption = "סלולארי")]
        public string Mobile { get; set; }
        [EntityProperty(Caption = "דואל")]
        public string Email { get; set; }
        #endregion

        public string Fax { get; set; }
        
        //public string WebSite { get; set; }
        
        public string Details { get; set; }
        
        public int AgentId { get; set; }
        
        public DateTime Creation { get; set; }
        //
        //public DateTime LastUpdate { get; set; }
        
        //public string Segments { get; set; }

        public string ToHtml()
        {
            return EntityProperties.ToHtmlTable<AccountView>(this,null, null, true);
        }

        //public string CreateSegments(byte customer, byte owner, byte invesment, byte tenant, byte profession, byte management,byte lead)
        //{
        //    StringBuilder sb = new StringBuilder();
        //    string segments = Types.NZorEmpty(Segments, "0000000000");
        //    sb.Append((customer > 1) ? segments[0].ToString() : customer.ToString());
        //    sb.Append((owner > 1) ? segments[1].ToString() : owner.ToString());
        //    sb.Append((invesment > 1) ? segments[2].ToString() : invesment.ToString());
        //    sb.Append((tenant > 1) ? segments[3].ToString() : tenant.ToString());
        //    sb.Append((profession > 1) ? segments[4].ToString() : profession.ToString());
        //    sb.Append((management > 1) ? segments[5].ToString() : management.ToString());
        //    sb.Append((lead > 1) ? segments[6].ToString() : lead.ToString());
        //    sb.Append("000");
        //    return sb.ToString();
        //}

//TypeId	TypeName
//0	לא ידוע
//1	לקוח
//2	בעלים
//3	משקיע
//4	דייר
//5	בעל מקצוע
//6	חברת ניהול


    }
}
