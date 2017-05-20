using Nistec;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Pro.Models
{
    public class CustomerQuery
    {
        public bool IsValid { get; private set; }
        public CustomerQuery() { }

        public CustomerQuery(HttpRequestBase Request)
        {
            string query_type = Request.Form["query_type"];
            switch (query_type)
            {
                  case "tab-news":
                    QueryType = 2;
                    NewsType = Request.Form["selectedNews"];
                    IsValid = string.IsNullOrEmpty(NewsType);
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
            AccType = Types.ToInt(Request.Form["AccType"],1);
            ReportType = Types.ToInt(Request.Form["ReportType"], 0);
        }
        public int QueryType { get; set; }
        public string NewsType { get; set; }
        public string CustomerName {get;set;}
        public string ContactName { get; set; }
        public int AccType { get; set; }
        //0=report,1=export csv
        public int ReportType { get; set; }

    }
}
