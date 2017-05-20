using Pro.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Pro.Lib
{
    public class TraceHelper
    {

        public static string GetReferrer(HttpRequestBase Request)
        {
            if (Request == null)
                return "";
            string referer = Request.ServerVariables["HTTP_REFERER"];
            if (string.IsNullOrEmpty(referer))
                return Request.ServerVariables["HTTP_HOST"]; ;
            return referer;
        }
        public static string GetReferrer(HttpRequest Request)
        {
            if (Request == null)
                return "";
            string referer = Request.ServerVariables["HTTP_REFERER"];
            if (string.IsNullOrEmpty(referer))
                return Request.ServerVariables["HTTP_HOST"]; ;
            return referer;
        }

        public static int Log(string folder, string Action, string LogText, HttpRequestBase request, int LogType = 0)
        {
            string referrer = GetReferrer(request);
            string clientIp = request == null ? "" : request.UserHostAddress;
            return DbNatam.Instance.ExecuteNonQuery("sp_Crm_Log", "Folder", folder, "Action", Action, "LogText", LogText, "Client", clientIp, "Referrer", referrer, "LogType", LogType);
        }
        public static int Log(string folder, string Action, string LogText, HttpRequest request, int LogType = 0)
        {
            string referrer = GetReferrer(request);
            string clientIp = request == null ? "" : request.UserHostAddress;
            return DbNatam.Instance.ExecuteNonQuery("sp_Crm_Log", "Folder", folder, "Action", Action, "LogText", LogText, "Client", clientIp, "Referrer", referrer, "LogType", LogType);
        }

        public static void TraceError(Exception exception)
        {
            try
            {
                //int accountId = GetAccountId();
                //Nistec.Trace.TraceException.Trace(Nistec.Trace.TraceStatus.ApplicationException, accountId, exception);
                Nistec.Trace.Log.Exception(exception);
            }
            catch { }
        }
        public static void TraceError(string message)
        {
            try
            {
                //int accountId = GetAccountId();
                //Nistec.Trace.TraceException.Trace(Nistec.Trace.TraceStatus.ApplicationException, accountId, message);
                Nistec.Trace.Log.Error(message);
            }
            catch { }
        }
    }
}
