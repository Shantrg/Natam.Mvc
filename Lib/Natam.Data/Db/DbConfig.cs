using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace Pro.Data
{
    public class DbConfig
    {
  
        public const string AddPool = ";Max Pool Size =250;Min Pool Size=5;Pooling=true";

        #region Connection

        public static string CnnNatam
        {
            get { return ConfigurationManager.ConnectionStrings["cnn_natam"].ConnectionString; }
            //get { return ConfigurationManager.AppSettings["cnn_natam"]; }
        }
        public static string CnnTrace
        {
            get { return ConfigurationManager.ConnectionStrings["cnn_Trace"].ConnectionString; }
        }
         #endregion

         public static IDbConnection NatamConnection
        {
            get { return new SqlConnection(CnnNatam); }
        }

    }
}
