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
using Pro.Data.Entities;

namespace Pro.Data.Entities
{

    [Entity(EntityName = "LeadsTracking", MappingName = "Crm_Leads_Tracking", ConnectionKey = "cnn_natam", EntityKey = new string[] { "RecordId" })]
    public class LeadsTrackingContext : EntityContext<LeadTraceItem>
    {
        #region ctor

        public LeadsTrackingContext()
        {
        }

        public LeadsTrackingContext(int RecordId)
            : base(RecordId)
        {
        }
        #endregion

        #region update
        /*
        public static int DoSave(int id, ReminderItem entity)
        {
            return DoSave(id, entity, id > 0 ? UpdateCommandType.Update : UpdateCommandType.Insert);
        }

        public static int DoDelete(int id)
        {
            using (LeadsFollowContext context = new LeadsFollowContext(id))
            {
                return context.SaveChanges(UpdateCommandType.Delete);
            }
        }

        public static int DoSave(int id, ReminderItem entity, UpdateCommandType commandType)
        {
            if (commandType == UpdateCommandType.Delete)
                using (LeadsFollowContext context = new LeadsFollowContext(id))
                {
                    return context.SaveChanges(commandType);
                }

            EntityValidator.Validate(entity, "מעקב", "he");

            if (commandType == UpdateCommandType.Insert)
                using (LeadsFollowContext context = new LeadsFollowContext())
                {
                    context.Set(entity);
                    return context.SaveChanges(commandType);
                }

            if (commandType == UpdateCommandType.Update)
                using (LeadsFollowContext context = new LeadsFollowContext(id))
                {
                    context.Set(entity);
                    return context.SaveChanges(commandType);
                }
            return 0;
        }
        */
        public static int DoSave(LeadTraceItem v, int mode)
        {

            EntityValidator.Validate(v, "מעקב שיחות", "he");
            
            var args = new object[]{
            "Mode",mode
            ,"LeadId",v.LeadId
            ,"AgentId",v.AgentId
            ,"LeadType",v.LeadType
            ,"ContactId",v.ContactId
            ,"Memo",v.Memo
            ,"RemindDate",v.RemindDate
            ,"State",v.State
            ,"RecordId",v.RecordId
            };
            var parameters = DataParameter.GetSql(args);
            //parameters[0].Direction = System.Data.ParameterDirection.InputOutput;
            int res = DbNatam.Instance.ExecuteNonQuery("sp_Leads_Trace", parameters, System.Data.CommandType.StoredProcedure);
            //v.TransId = Types.ToInt(parameters[0].Value);
            return res;// v.TransId;
        }

        public static int DoAdd(LeadTraceItem v)
        {
            return DoSave(v,0);
        }
        public static int DoUpdate(int recordId, int contactId,string memo,DateTime? remindDate, int state)
        {
            return DoSave(new LeadTraceItem()
            {
                RecordId=recordId,
                ContactId=contactId,
                Memo = memo,
                RemindDate=remindDate,
                State=state
            },1);
        }
        public static int DoDelete(int RecordId)
        {

            int res = DbNatam.Instance.ExecuteNonQuery("sp_Leads_Trace_State", "RecordId", RecordId, "State", 200);
            return res;


            //return DoSave(new LeadTraceItem()
            //{
            //    RecordId = recordId
            //}, 1);
        }

        public static int DoTraceCompleted(int RecordId)
        {
                int res = DbNatam.Instance.ExecuteNonQuery("sp_Leads_Trace_State", "RecordId",RecordId,"State",10);
                return res;
        }

        public static int DoTraceDelay(int RecordId, int Days)
        {
            int res = DbNatam.Instance.ExecuteNonQuery("sp_Leads_Trace_State", "RecordId", RecordId, "State", 1, "Days", Days);
            return res;
        }

         public static int DoMessager(int LeadId,int LeadType,int Target, int Sender,int ContactId,DateTime RemindDate)
        {
           
            var args = new object[]{
            "LeadId",LeadId
            ,"LeadType",LeadType
            ,"Target",Target
            ,"Sender",Sender
            ,"ContactId",ContactId
            ,"RemindDate",RemindDate
            };
            var parameters = DataParameter.GetSql(args);
            int res = DbNatam.Instance.ExecuteNonQuery("sp_Messager", parameters, System.Data.CommandType.StoredProcedure);
            return res;
        }

        #endregion

        #region static
        public static IEnumerable<LeadTraceView> ViewByLead(int LeadId)
        {
            return DbNatam.Instance.EntityItemList<LeadTraceView>("vw_Leads_Tracking", "LeadId", LeadId);
        }
        public static IEnumerable<LeadTraceView> ViewByAgent(int AgentId)
        {
            return DbNatam.Instance.EntityItemList<LeadTraceView>("vw_Leads_Tracking", "AgentId", AgentId);
        }
        public static IEnumerable<LeadTraceView> ViewList(int AgentId)
        {
            return DbNatam.Instance.EntityItemList<LeadTraceView>("vw_Leads_Tracking", "AgentId", AgentId);
        }

        public static string ViewLeadsReminder(int AgentId)
        {
            return DbNatam.Instance.ExecuteJson("sp_Leads_Reminder", "AgentId", AgentId);
            //return DbNatam.Instance.QueryJson("select * from vw_Leads_Reminder where AgentId=@AgentId", "AgentId", AgentId);
        }
        #endregion
    }


    public class LeadTraceView : LeadTraceItem
    {
        //public string UserName { get; set; }
        public string CustomerName { get; set; }
        public string ContactName { get; set; }
        public string ContactTitle { get; set; }
        public string ContactMobile { get; set; }
    }

    public class LeadTraceItem : IEntityItem
    {

        [EntityProperty(EntityPropertyType.Identity)]
        public int RecordId { get; set; }
        public DateTime Creation { get; set; }
        public DateTime LastUpdate { get; set; }
        public DateTime? RemindDate { get; set; }
        public string Memo { get; set; }
        public int ContactId { get; set; }
        public int LeadId { get; set; }
        public int AgentId { get; set; }
        public int State { get; set; }
        public int LeadType { get; set; }
       // public string LeadTypeName { get { return LeadType == 1 ? "עסקה מצד הקונה" : "עסקה מצד המוכר"; } }

    }

}
