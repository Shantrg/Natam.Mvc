using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Natam.Crm
{
    public class TraceHelper
    {
        //public static int GetAccountId()
        //{
        //    return Nistec.Generic.NetConfig.Get<int>("account", 0);
        //}
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
