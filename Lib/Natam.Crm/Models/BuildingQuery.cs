using Nistec;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Natam.Crm.Models
{
    public class BuildingQuery
    {
        public BuildingQuery() { }

        public BuildingQuery(HttpRequestBase Request)
        {
            string query_type = Request.Form["query_type"];
            switch (query_type)
            {
                case "tab-natam":
                    QueryType = 4;
                    BuildingId = Types.ToInt(Request.Form["listNatam"]);
                    break;
                 case "tab-owner":
                    QueryType = 3;
                    OwnerId = Types.ToInt(Request.Form["listOwner"]);
                    break;
               case "tab-address":
                    BuildingName = Request.Form["building_name"];
                    BuildingStreet = Request.Form["building_street"];
                    StreetNo = Nistec.Types.ToInt(Request.Form["building_num"]);
                    City = Request.Form["building_city"];
                    QueryType = 2;
                    break;
                case "tab-general":
                    AgentId = Nistec.Types.ToInt(Request.Form["agent_id"]);
                    Area = Request.Form["listArea"];
                    AreaSizeMin = Types.ToInt(Request.Form["size-from"]);
                    AreaSizeMax = Types.ToInt(Request.Form["size-to"]);
                    DealType = Types.ToInt(Request.Form["listDeal"]);
                    PurposeType = Types.ToInt(Request.Form["listPurpose"]);
                    ShowNewOnly = Types.ToBool(Request.Form["show_new_only"], false);
                    QueryType = 1;
                    break;
                default:
                    QueryType = 0;
                    break;

            }
        }
        public int QueryType { get; set; }
        
        public int AgentId{get;set;}
        public string Area { get; set; }
        public int AreaSizeMin { get; set; }
        public int AreaSizeMax { get; set; }
        public int DealType {get;set;}
        public int PurposeType {get;set;}
        public bool ShowNewOnly {get;set;}

        public string BuildingName {get;set;}
        public string BuildingStreet { get; set; }
        public int StreetNo {get;set;}
        public string City { get; set; }
        public int OwnerId { get; set; }
        public int BuildingId { get; set; }
    }
}
