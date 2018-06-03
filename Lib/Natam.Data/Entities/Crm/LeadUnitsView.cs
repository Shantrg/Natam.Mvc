using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;

namespace Pro.Data.Entities
{


    public class LeadUnitsView : EntityItem<DbNatam>, IEntityItem
    {
        #region override

        public override string MappingName()
        {
            return "Crm_Leads_List";
        }
 
        public override EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        {
            EntityValidator validator = new EntityValidator("רשימת נכסים ללקוח", "he");
            validator.Required(UnitId, "קוד נכס");
            return validator;
        }
        #endregion

        public static IEnumerable<LeadUnitsView> View(int LeadId)
        {
            return DbNatam.Instance.EntityItemList<LeadUnitsView>(TableName, "LeadId", LeadId);
        }
        public static LeadUnitsView View(int LeadId,int UnitId)
        {
            return DbNatam.Instance.EntityItemGet<LeadUnitsView>(TableName, "LeadId", LeadId, "UnitId", UnitId);
        }
        public static int DeleteList(int LeadId)
        {
            return DbNatam.Instance.ExecuteCommand("delete from Crm_Leads_List where LeadId=@LeadId", System.Data.CommandType.Text, "LeadId", LeadId);
        }

        public const string TableName = "Crm_Leads_List";


        #region properties

        [EntityProperty(EntityPropertyType.Key)]
        public int LeadId { get; set; }
        
        [Validator("קוד נכס", true)]
        [EntityProperty(EntityPropertyType.Key)]
        public string UnitId { get; set; }

        #endregion

        public static int DoAdd(LeadUnitsView view)
        {
            return view.DoInsert<LeadUnitsView>();
        }
        public static int DoRemove(LeadUnitsView view)
        {
            return view.DoDelete<LeadUnitsView>();
        }


    }

}
