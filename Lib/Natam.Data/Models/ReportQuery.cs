using Nistec;
using Nistec.Data;
using Pro.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;

namespace Pro.Models
{
    public class ReportQuery
    {

        public DataTable ExportByQuery()//int ReportType, string Area, string Arg1, string Arg2, string Arg3)
        {
            try
            {
                var parameters = DataParameter.GetSql("ReportType", ReportType, "Area", Area, "Arg1", Arg1, "Arg2", Arg2, "Arg3", Arg3);
                var dt = DbNatam.Instance.ExecuteCommand<DataTable>("sp_Report", parameters, CommandType.StoredProcedure);
                return dt;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public bool IsValid { get; private set; }
        public ReportQuery() { }

        public ReportQuery(HttpRequestBase Request)
        {
            ReportType = Types.ToInt( Request.Form["query_type"]);
            switch (ReportType)
            {
                  case 1:
                    ReportName = "properties_by_area";
                    Area = Request.Form["Area"];
                    break;
                  case 2:
                    ReportName = "properties_by_address";
                    Arg1 = Request.Form["building_city"];
                    Arg2 = Request.Form["building_street"];
                    break;
                  case 3:
                    ReportName = "owners_by_area";
                    Area = Request.Form["Area"];
                    break;
                  case 4:
                    ReportName = "customers_requests";
                    Area = Request.Form["Area"];
                    Arg1 = Request.Form["Purpose"];
                    //Arg2 = Request.Form["size-from"];
                    //Arg3 = Request.Form["size-to"];

                    Arg2 = Request.Form["RequestSize"];

                    break;
                  case 5:
                    ReportName = "free_space_report";
                    Area = Request.Form["Area"];
                    Arg1 = Request.Form["Deal"];
                    //Arg2 = Request.Form["size-from"];
                    //Arg3 = Request.Form["size-to"];
                    Arg2 = Request.Form["RequestSize"];

                    break;
                   
                    //IsValid = string.IsNullOrEmpty(NewsType);
                   
            }
            
        }
        public int ReportType { get; set; }
        public string Area { get; set; }
        public string Arg1 {get;set;}
        public string Arg2 { get; set; }
        public string Arg3 { get; set; }

        public string ReportName { get; set; }
    }
}
