using Nistec;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Pro.Models
{
    public class LeadsQuery
    {
        public bool IsValid { get; private set; }
        public LeadsQuery() { }

        public LeadsQuery(HttpRequestBase Request, int agentId)
        {
            string query_type = Request.Form["query_type"];
            switch (query_type)
            {
                  case "tab-news":
                    QueryType = 2;
                    DealType = Request.Form["DealType"];
                    PurposeType = Request.Form["PurposeType"];
                    AreaType = Request.Form["AreaType"];
                    RequestSize = Types.ToInt( Request.Form["RequestSize"]);
                    IsValid =true;// string.IsNullOrEmpty(NewsType);
                    break;
                 case "tab-general":
                    CustomerName = Request.Form["CustomerName"];
                    ContactName = Request.Form["ContactName"];
                    QueryType = 1;
                    IsValid =true;// string.IsNullOrEmpty(CustomerName) || string.IsNullOrEmpty(ContactName) || string.IsNullOrEmpty(City);
                    break;
                default:
                    QueryType = 0;
                    break;

            }
            AgentId = agentId;
            ReportType = Types.ToInt(Request.Form["ReportType"], 0);
        }
        public int QueryType { get; set; }
        public string NewsType { get; set; }
        public string CustomerName {get;set;}
        public string ContactName { get; set; }
        public int AgentId { get; set; }

         public string DealType { get; set; }
         public string PurposeType { get; set; }
         public string AreaType { get; set; }
         public int RequestSize { get; set; }
        //0=report,1=export csv
        public int ReportType { get; set; }

    }
}
