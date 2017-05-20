using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;

namespace Natam.Data.Entities
{

    public class PropertyView : IEntityItem
    {
        public const string MappingName = "Properties";

        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int Property_ID{get; set;}
        
        [EntityProperty]
        public string Property_Name{get; set;}
        
        [EntityProperty]
        public string Kategory{get; set;}
        
        [EntityProperty]
        public int Area_Type{get; set;}
        
        #endregion

    }


    public class PropertyData : PropertyView
    {

        #region properties

        [EntityProperty]
        public string Property_Name_1{get; set;}
       
        [EntityProperty]
        public string Property_Name_2{get; set;}
       
        [EntityProperty]
        public string Property_Name_3{get; set;}
       
        [EntityProperty]
        public string Property_Name_4{get; set;}

        [EntityProperty]
        public string Property_Name_5{get; set;}
        #endregion

    }
 
}
