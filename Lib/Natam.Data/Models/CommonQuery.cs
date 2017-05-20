using Nistec;
using Nistec.Data;
using Nistec.Serialization;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Web;

namespace Pro.Models
{
    [Serializable]
    public class CommonQuery:QueryBase
    {
        public string HTitle { get; set; }
        public string Serialize()
        {
           var ser= BinarySerializer.SerializeToBase64(this);
           return ser;
        }
        public static CommonQuery Deserialize(string ser)
        {
            return BinarySerializer.DeserializeFromBase64<CommonQuery>(ser);
        }

        public int QueryType { get; set; }
        public int UserId { get; set; }

        public CommonQuery()
        {
           
        }

        //public CommonQuery(NameValueCollection Request)
        //{

        //     QueryType = Types.ToInt(Request["QueryType"]);
        //}

        public CommonQuery(HttpRequestBase Request)
        {
            QueryType = Types.ToInt(Request["QueryType"]);
            
            LoadSortAndFilter(Request);
        }

        public void Normelize()
        {

        }
  
       
    }
}
