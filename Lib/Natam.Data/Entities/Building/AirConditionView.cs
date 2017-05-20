using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;

namespace Pro.Data.Entities
{

    public class AirConditionView : EntityItem<DbNatam>, IEntityItem
    {
        #region override

        public override string MappingName()
        {
            return "Crm_AirCondition";
        }

        public override EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        {
            EntityValidator validator = new EntityValidator("סוג מיזוג", "he");
            validator.Required(AirConditionName, "סוג מיזוג");
            return validator;
        }

        #endregion

        public static IEnumerable<AirConditionView> View()
        {
            return DbNatam.Instance.EntityItemList<AirConditionView>(TableName, null);
        }
        public static AirConditionView View(int AirconditionId)
        {
            return DbNatam.Instance.EntityItemGet<AirConditionView>(TableName, "AirconditionId",AirconditionId);
        }

        public const string TableName = "Crm_AirCondition";

        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int AirConditionId { get; set; }

        
        [Validator(Required = true, Langs = "en:Air condition type|he:סוג מיזוג")]
        public string AirConditionName { get; set; }

        #endregion

    }
 
}
