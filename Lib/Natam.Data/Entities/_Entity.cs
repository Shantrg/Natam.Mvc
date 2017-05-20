using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;

namespace Pro.Data.Entities
{

    public class _Entity : IEntityItem
    {
        public const string MappingName = "_Entity";

        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int Property_ID {get; set;}

        
        public string Property_Name{get; set;}

        
        public string Category{get; set;}

        
        public string Area_Type{get; set;}

        #endregion

    }
 
}
