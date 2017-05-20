using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;
using Nistec.Generic;

namespace Pro.Data.Entities
{

    public class AreaZoneView : AreaView
    {
        public static IEnumerable<AreaZoneView> ViewAreaZone()
        {
            return DbNatam.Instance.EntityItemList<AreaZoneView>("vw_AreaZone", null);
        }

        
        public string ZoneName { get; set; }
    }
    
    public class AreaView : EntityItem<DbNatam>, IEntityItem
    {
        #region override

        public override string MappingName()
        {
             return "Crm_Area";
        }
        //public override IDbContext Db
        //{
        //    get { return DbNatam.Instance; }
        //}
        //public override AreaView Entity
        //{
        //    get { return this; }
        //}

        public override EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        {
            EntityValidator validator = new EntityValidator("אזור", "he");
            validator.Required(AreaName, "שם האזור");
            return validator;
        }
        #endregion


        public static IEnumerable<AreaView> View()
        {
            return DbNatam.Instance.EntityItemList<AreaView>(TableName, null);
        }

        public static IEnumerable<AreaView> Filter(int ZoneId)
        {
            if (ZoneId < 0)
                return View();
            return DbNatam.Instance.EntityItemList<AreaView>(TableName, "ZoneId", ZoneId);
        }

        public static AreaView View(int AreaId)
        {
            return DbNatam.Instance.EntityItemGet<AreaView>(TableName, "AreaId", AreaId);
        }

        //public int Update(AreaView newItem, UpdateCommandType command)
        //{
        //    int res = DbNatam.Instance.SetEntity<AreaView>(MappingName, this, newItem, command);
        //    return res;
        //}

        public const string TableName = "Crm_Area";

        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int AreaId { get; set; }

        
        public string AreaName { get; set; }

        //
        //public string AreaName_en { get; set; }

        
        public int ZoneId { get; set; }

        #endregion

    }
 
}
