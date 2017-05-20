using Nistec;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Pro.Models
{
    public class PropertyQuery
    {
        //public bool IsValid { get; private set; }
        public PropertyQuery() { }

        //public PropertyQuery(HttpRequestBase Request, int agentId)
        //{
        //    string query_type = Request.Form["query_type"];
        //    switch (query_type)
        //    {
        //        case "tab-address":
        //            Address = Request.Form["building_address"];
        //            City = Request.Form["building_city"];
        //            QueryType = 2;
        //            IsValid = !string.IsNullOrEmpty(Address) || !string.IsNullOrEmpty(City);
        //            break;
        //        case "tab-general":
        //            AgentId = Nistec.Types.ToInt(Request.Form["agent_id"]);
        //            AreaId = Request.Form["Area"]; 
        //            SizeMin = Types.ToInt(Request.Form["size-from"]);
        //            SizeMax = Types.ToInt(Request.Form["size-to"]);
        //            DealType = Types.ToInt(Request.Form["Deal"]);
        //            PurposeType = Types.ToInt(Request.Form["Purpose"]);
        //            //ShowNewOnly = Types.ToBool(Request.Form["show_new_only"], false);
        //            QueryType = 1;
        //            IsValid = true;
        //            break;
        //        default:
        //            QueryType = 0;
        //            break;

        //    }
        //    AgentId = agentId;
        //}
        public int PropertyType { get; set; }
        public int AgentId { get; set; }
        public string AreaType { get; set; }
        public string DealType { get; set; }
        public string PurposeType { get; set; }
        public string RequestSize { get; set; }
        public int ParentId { get; set; }

        //public string Address { get; set; }
        //public string City { get; set; }

    }
}
