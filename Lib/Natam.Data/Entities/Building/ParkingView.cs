using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;

namespace Pro.Data.Entities
{
    public class ParkView : EntityItem<DbNatam>, IEntityItem
    {
        #region override

        public override string MappingName()
        {
             return "Crm_Park";
        }
 
        public override EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        {
            EntityValidator validator = new EntityValidator("סוג חנייה", "he");
            validator.Required(ParkName, "שם החנייה");
            return validator;
        }
        #endregion

        public static IEnumerable<ParkView> View()
        {
            return DbNatam.Instance.EntityItemList<ParkView>(TableName, null);
        }
        public static ParkView View(int ParkId)
        {
            return DbNatam.Instance.EntityItemGet<ParkView>(TableName, "ParkId",ParkId);
        }
        public const string TableName = "Crm_Park";

        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int ParkId { get; set; }

        
        public string ParkName { get; set; }

        #endregion

    }
 
}
