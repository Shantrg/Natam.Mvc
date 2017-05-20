using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;

namespace Pro.Data.Entities
{
    public class ZoneView : EntityItem<DbNatam>, IEntityItem
    {
        #region override

        public override string MappingName()
        {
             return "Crm_Zone";
        }
        //public override IDbContext Db
        //{
        //    get { return DbNatam.Instance; }
        //}
        //public override ZoneView Entity
        //{
        //    get { return this; }
        //}

        public override EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        {
            EntityValidator validator = new EntityValidator("אזור", "he");
            validator.Required(ZoneName, "שם האזור");
            return validator;
        }
        #endregion

        public static IEnumerable<ZoneView> View()
        {
            return DbNatam.Instance.EntityItemList<ZoneView>(TableName, null);
        }
        public static ZoneView View(int ZoneId)
        {
            return DbNatam.Instance.EntityItemGet<ZoneView>(TableName, "ZoneId", ZoneId);
        }
        //public int Update(ZoneView newItem, UpdateCommandType command)
        //{
        //    int res = DbNatam.Instance.SetEntity<ZoneView>(MappingName, this, newItem, command);
        //    return res;
        //}
        public const string TableName = "Crm_Zone";

        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int ZoneId { get; set; }

        [EntityProperty]
        public string ZoneName { get; set; }

        #endregion

    }
 
}
