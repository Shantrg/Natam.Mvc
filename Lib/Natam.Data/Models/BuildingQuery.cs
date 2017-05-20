using Nistec;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Pro.Models
{
    public class BuildingQuery
    {
        public bool IsValid { get; private set; }
        public BuildingQuery() { }

        public BuildingQuery(HttpRequestBase Request)
        {
            string query_type = Request["query_type"];
            switch (query_type)
            {
                case "tab-query-building":
                    BuildingId = Types.ToInt(Request["bid"]);
                    QueryType = 4;
                    IsValid = BuildingId > 0;
                    break;
                case "tab-query-unit":
                    BuildingId = Types.ToInt(Request["bid"]);
                    QueryType = 4;
                    IsValid = BuildingId > 0;
                    break;
                case "tab-natam":
                    QueryType = 4;
                    BuildingId = Types.ToInt(Request["selectedNatamId"]);//Request.Form["listNatam"]);
                    IsValid = BuildingId > 0;
                    break;
                 case "tab-owner":
                    QueryType = 3;
                    OwnerId = Types.ToInt(Request["selectedOwnerId"]);//Request.Form["listOwner"]);
                    IsValid = OwnerId > 0;
                    break;
               case "tab-address":
                    BuildingName = Request["building_name"];
                    BuildingStreet = Request["building_street"];
                    StreetNo = Request["building_num"];
                    City = Request["building_city"];
                    QueryType = 2;
                    IsValid = !string.IsNullOrEmpty(BuildingName) || !string.IsNullOrEmpty(BuildingStreet) || !string.IsNullOrEmpty(City);
                    break;
                case "tab-general":
                    AgentId = Nistec.Types.ToInt(Request["agent_id"]);
                    Area = Request.Form["Area"];//Request.Form["listArea"];
                    AreaSizeMin = Types.ToInt(Request["size-from"]);
                    AreaSizeMax = Types.ToInt(Request["size-to"]);
                    DealType = Types.ToInt(Request["Deal"]);//Types.ToInt(Request.Form["listDeal"]);
                    PurposeType = Types.ToInt(Request["Purpose"]);//Types.ToInt(Request.Form["listPurpose"]);
                    ShowNewOnly = Types.ToBool(Request["show_new_only"], false);

                    string search_type = Request["search_type"];
                    if (search_type == "Buildings")

                        QueryType = 10;
                    else
                        QueryType = 1;


                    IsValid = true;
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
        public string StreetNo { get; set; }
        public string City { get; set; }
        public int OwnerId { get; set; }
        public int BuildingId { get; set; }
    }
}
