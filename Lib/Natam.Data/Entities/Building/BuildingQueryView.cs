using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;

namespace Pro.Data.Entities
{

    public class BuildingQueryView2 : IEntityItem
    {
 
        #region properties

        [EntityProperty(EntityPropertyType.Identity, Caption = "נכס")]
        public int ID
        {
            get;
            set;
        }
        [EntityProperty(EntityPropertyType.Default, false, Column = "BuildingCity", Caption = "עיר")]
        public string BuildingCity
        {
            get;
            set;
        }

        [EntityProperty(EntityPropertyType.Default, false, Column = "BuildingName", Caption = "שם הנכס")]
        public string BuildingName
        {
            get;
            set;
        }

        [EntityProperty(EntityPropertyType.Default, false, Column = "BuildingStreet", Caption = "רחוב")]
        public string BuildingStreet
        {
            get;
            set;
        }
         [EntityProperty(EntityPropertyType.Default, false, Column = "BuildingFloortAreaMr",Caption = "שטח פנוי")]
        public string BuildingFloortAreaMr
        {
            get;
            set;
        }

        [EntityProperty(EntityPropertyType.Default, false, Column = "BuildingContactPerson",Caption = "איש קשר")]
        public string BuildingContactPerson
        {
            get;
            set;
        }
         [EntityProperty(EntityPropertyType.Default, false, Column = "BuildingPopulationDate",Caption = "מועד עדכון")]
        public DateTime BuildingPopulationDate
        {
            get;
            set;
        }
         [EntityProperty(EntityPropertyType.Default, false, Column = "ShowAddToList", Caption = "הוסף לפנקס")]
         public int ShowAddToList
         {
             get;
             set;
         }
        [EntityProperty(EntityPropertyType.Default, false, Column = "ShowInfo",Caption = "מידע נוסף")]
         public int ShowInfo
        {
            get;
            set;
        }
         [EntityProperty(EntityPropertyType.Default, false, Column = "ShowPicture",Caption = "הצג תמונה")]
        public int ShowPicture
        {
            get;
            set;
        }
         [EntityProperty(EntityPropertyType.Default, false, Column = "ShowMap",Caption = "הצג מפה")]
         public int ShowMap
        {
            get;
            set;
        }
         [EntityProperty(EntityPropertyType.Default, false, Column = "ShowComment",Caption = "הוסף הערה")]
         public int ShowComment
        {
            get;
            set;
        }
         [EntityProperty(EntityPropertyType.Default, false, Column = "ShowHistrtory",Caption = "היסטוריה")]
         public int ShowHistrtory
        {
            get;
            set;
        }
         [EntityProperty(EntityPropertyType.Default, false, Column = "ShowUnitsDetails",Caption = "פירוט יחידות")]
        public int ShowUnitsDetails
        {
            get;
            set;
        }

       #endregion

      
    }
 
}
