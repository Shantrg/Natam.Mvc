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

    public class CityRegionView : CityView
    {
        public static IEnumerable<CityRegionView> ViewCityRegion()
        {
            return DbNatam.Instance.EntityItemList<CityRegionView>("vw_", null);
        }
        
        public string RegionName { get; set; }
    }
    
    public class CityView : EntityItem<DbNatam>, IEntityItem
    {
        #region override

        public override string MappingName()
        {
             return "Dmg_Cities";
        }

        public override EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        {
            EntityValidator validator = new EntityValidator("עיר", "he");
            validator.Required(CityName, "שם העיר");
            return validator;
        }
        #endregion


        public static IEnumerable<CityView> View()
        {
            return DbNatam.Instance.EntityItemList<CityView>(TableName, null);
        }

        public static IEnumerable<CityView> Filter(int Region)
        {
            if (Region < 0)
                return View();
            return DbNatam.Instance.EntityItemList<CityView>(TableName, "Region", Region);
        }

        public static CityView View(int Region)
        {
            return DbNatam.Instance.EntityItemGet<CityView>(TableName, "Region", Region);
        }

        //public int Update(AreaView newItem, UpdateCommandType command)
        //{
        //    int res = DbNatam.Instance.SetEntity<AreaView>(MappingName, this, newItem, command);
        //    return res;
        //}

        public const string TableName = "Dmg_Cities";

        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int CityCode { get; set; }
       
        public string CityName { get; set; }

        public int Region { get; set; }
        public int AreaCode { get; set; }
        #endregion

    }


    public class StreetCityView : StreetView
    {
        public static IEnumerable<StreetCityView> ViewStreetCity()
        {
            return DbNatam.Instance.EntityItemList<StreetCityView>("vw_Dmg_Streets", null);
        }

        public int CityCode { get; set; }
    }

    public class StreetView : EntityItem<DbNatam>, IEntityItem
    {
        #region override

        public override string MappingName()
        {
            return "Dmg_Streets";
        }

        public override EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        {
            EntityValidator validator = new EntityValidator("רחוב", "he");
            validator.Required(StreetName, "שם הרחוב");
            return validator;
        }
        #endregion


        public static IEnumerable<StreetView> View()
        {
            return DbNatam.Instance.EntityItemList<StreetView>(TableName, null);
        }

        public static IEnumerable<StreetView> Filter(int CityCode)
        {
            if (CityCode < 0)
                return View();
            return DbNatam.Instance.EntityItemList<StreetView>(TableName, "CityCode", CityCode);
        }

        public static StreetView View(int CityCode)
        {
            return DbNatam.Instance.EntityItemGet<StreetView>(TableName, "CityCode", CityCode);
        }

        //public int Update(AreaView newItem, UpdateCommandType command)
        //{
        //    int res = DbNatam.Instance.SetEntity<AreaView>(MappingName, this, newItem, command);
        //    return res;
        //}

        public const string TableName = "Dmg_Streets";

        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int StreetId { get; set; }

        public string StreetName { get; set; }

        public int CityCode { get; set; }

        #endregion

    }

}
