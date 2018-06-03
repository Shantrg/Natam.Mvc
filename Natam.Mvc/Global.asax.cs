using Pro.Lib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Natam.Mvc
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();
        }
        void Application_Error(object sender, EventArgs e)
        {
            var error = Server.GetLastError();
            var code = (error is HttpException) ? (error as HttpException).GetHttpCode() : 500;
            string msg = error.Message;
            string errpath = "~/Home/Error";

            if (code == 404)
            {
                errpath = "~/Home/ErrorNotFound";
                msg = string.Concat(msg, ";FilePath:", Request.CurrentExecutionFilePath);
            }
            else
            {
                msg = string.Concat(msg, error.StackTrace ?? "");
            }
            if (msg.Contains("The file '/login.aspx' does not exist.;FilePath:/login.aspx"))
            {
                Response.Clear();
                Server.ClearError();
                Response.Redirect("~/Home/Index");
                return;
            }
            Response.Clear();
            Server.ClearError();
            TraceHelper.Log("Application", "Error", msg, Request, 100);

            //Response.Redirect(String.Format("{0}/?message={1}", errpath, error.Message));
        
            HttpContext.Current.Response.RedirectToRoute("RouteError", new { Id = code, message= error.Message });

        }
    }
}