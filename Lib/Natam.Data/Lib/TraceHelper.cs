using Pro.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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

        public static Task<int> LogAsync(string folder, string Action, string LogText, string clientIp, string referrer, int LogType = 0)
        {

            return Task.Factory.StartNew(() => //Log(folder, Action, LogText, clientIp, referrer, LogType));
            {
                try
                {
                    return DbNatam.Instance.ExecuteNonQuery("sp_Crm_Log", "Folder", folder, "Action", Action, "LogText", LogText, "Client", clientIp, "Referrer", referrer, "LogType", LogType);
                }
                catch (Exception ex)
                {
                    string err = ex.Message;
                    return -1;
                }
            });
        }

        //public async static Task<int> LogAsync(string folder, string Action, string LogText, HttpRequestBase request, int LogType = 0)
        //{
        //    return await Task.Run(() => TraceHelper.Log(folder, Action, LogText, request, LogType));
        //}
        public static Task<int> LogAsync(string folder, string Action, string LogText, HttpRequestBase request, int LogType = 0)
        {
            return Task.Factory.StartNew(() => Log(folder, Action, LogText, request, LogType));
        }


        public static int Log(string folder, string Action, string LogText, HttpRequestBase request, int LogType = 0)
        {
            try
            {
                string referrer = GetReferrer(request);
                string clientIp = request == null ? "" : request.UserHostAddress;
                return DbNatam.Instance.ExecuteNonQuery("sp_Crm_Log", "Folder", folder, "Action", Action, "LogText", LogText, "Client", clientIp, "Referrer", referrer, "LogType", LogType);
            }
            catch(Exception ex)
            {
                string err = ex.Message;
                return -1;
            }
        }
        public static int Log(string folder, string Action, string LogText, HttpRequest request, int LogType = 0)
        {
            try
            {
                string referrer = GetReferrer(request);
                string clientIp = request == null ? "" : request.UserHostAddress;
                return DbNatam.Instance.ExecuteNonQuery("sp_Crm_Log", "Folder", folder, "Action", Action, "LogText", LogText, "Client", clientIp, "Referrer", referrer, "LogType", LogType);
            }
            catch (Exception ex)
            {
                string err = ex.Message;
                return -1;
            }
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
