using Nistec;
using Pro.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Pro.Models
{
    public class AccountQuery
    {
        public bool IsValid { get; private set; }
        public AccountQuery() { }

        public AccountQuery(AccountTypes accountType)
        {
            AccType = (int)accountType;
            QueryType = 0;
        }
        public AccountQuery(HttpRequestBase Request)
        {
            string query_type = Request.Form["query_type"];
            switch (query_type)
            {
                  case "tab-news":
                    QueryType = 2;
                    IsValid =true;
                    break;
                 case "tab-general":
                    AccountName = Request.Form["AccountName"];
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
        public string AccountName { get; set; }
        public string ContactName { get; set; }
        public int AccType { get; set; }
        //0=report,1=export csv
        public int ReportType { get; set; }

    }
}
