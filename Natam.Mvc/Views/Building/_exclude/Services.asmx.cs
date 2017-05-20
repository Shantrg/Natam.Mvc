using Natam.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Script.Services;
using System.Web.Services;

namespace Natam.Mvc
{
    /// <summary>
    /// Summary description for Services
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class Services : System.Web.Services.WebService
    {
        //[WebMethod]
        //[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        //public JsonResult GetDealView()
        //{
        //    var list = DealView.View();
        //    //var json= Nistec.Runtime.Json.JsonSerializer.ToJson(list);
        //    return new JsonResult() { Data = list };
        //}
        //[WebMethod]
        //[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        //public string GetDealView()
        //{
        //    var list = DealView.View();
        //    //var json= Nistec.Runtime.Json.JsonSerializer.ToJson(list);
        //    return "{\"DealId\":\"1\",\"DealName\":\"Center\"}";
        //}

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<DealView> GetDealView()
        {
            var list = DealView.View();
            //var json= Nistec.Runtime.Json.JsonSerializer.ToJson(list);
            return list.ToList();
        }

    }
}
