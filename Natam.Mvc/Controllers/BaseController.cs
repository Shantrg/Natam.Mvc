using Pro.Models;
using Natam.Mvc.Models;
using Nistec;
using Nistec.Web.Cms;
using Nistec.Web.Security;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Caching;
using System.Web.Mvc;
using Pro.Lib;

namespace Natam.Mvc.Controllers
{
    public abstract class BaseController : Controller
    {

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (Request.IsAuthenticated)
            {
                var signedUser = SignedUser.Get(Request.RequestContext.HttpContext);
                if (signedUser != null && signedUser.IsAuthenticated)
                {
                    ViewBag.UserId = signedUser.UserId;
                    ViewBag.UserName = signedUser.UserName;
                    ViewBag.UserRole = signedUser.UserRole;

                    ViewBag.UserInfo = new UserModel()
                    {
                        UserId = signedUser.UserId,
                        UserName = signedUser.UserName,
                        UserRole = signedUser.UserRole,
                        //AccountId = signedUser.AccountId
                    };
                }
            }
            // Modify current thread's culture            
            Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture("he-IL");
            Thread.CurrentThread.CurrentUICulture = CultureInfo.CreateSpecificCulture("he-IL");

            //if (Request.UserLanguages != null)
            //{

            //    // Validate culture name
            //    string cultureName = Request.UserLanguages[0]; // obtain it from HTTP header AcceptLanguages
            //    if (!string.IsNullOrEmpty(cultureName))
            //    {
            //        // Modify current thread's culture            
            //        Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(cultureName);
            //        Thread.CurrentThread.CurrentUICulture = CultureInfo.CreateSpecificCulture(cultureName);
            //    }
            //}
  
            base.OnActionExecuting(filterContext);
        }


        protected string RenderPartialViewToString(string viewName, object model)
        {
            if (string.IsNullOrEmpty(viewName))
                viewName = ControllerContext.RouteData.GetRequiredString("action");

            ViewData.Model = model;

            using (var sw = new StringWriter())
            {
                ViewEngineResult viewResult = ViewEngines.Engines.FindPartialView(ControllerContext, viewName);
                var viewContext = new ViewContext(ControllerContext, viewResult.View, ViewData, TempData, sw);
                viewResult.View.Render(viewContext, sw);

                return sw.GetStringBuilder().ToString();
            }
        }

        protected bool IsAdmin()
        {
            var signedUser = SignedUser.GetAdmin(Request.RequestContext.HttpContext);
            if (signedUser == null)
            {
                return false;
            }
            return signedUser.IsAdmin;
        }

        protected int GetUser()
        {
            var signedUser = SignedUser.Get(Request.RequestContext.HttpContext);
            if (signedUser == null || !signedUser.IsAuthenticated)
            {
                return 0;
            }
            ViewBag.UserName = signedUser.UserName;
            return signedUser.UserId;
        }

        protected ActionResult Authenticate(object value)
        {
            var signedUser = SignedUser.Get(Request.RequestContext.HttpContext);
            if (signedUser == null || !signedUser.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }
            ViewBag.UserId = signedUser.UserId;
            ViewBag.UserName = signedUser.UserName;
            ViewBag.UserRole = signedUser.UserRole;
            if (value != null)
                return View(value);
            return View();
        }

        protected ActionResult AuthenticateAdmin(object value)
        {
            var signedUser = SignedUser.GetAdmin(Request.RequestContext.HttpContext);
            if (signedUser == null || !signedUser.IsAdmin)
            {
                return RedirectToAction("Manager", "Admin");
            }
            ViewBag.UserName = signedUser.UserName;
            if (value != null)
                return View(value);
            return View();
        }

        protected virtual ActionResult RedirectToIndex(string message)
        {

            ViewBag.Message = message;

            ModelState.AddModelError("ErrorMessage", "The user name or password provided is incorrect.");

            return RedirectToAction("Index", "Home", ModelState);//new { ErrorMessage = message });

        }

        protected virtual ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Main", "Home");
            }
        }

        protected virtual ActionResult RedirectToStatus(string message)
        {
            return RedirectToAction("StatusMessage", new {msg=message });
        }

        public ViewResult StatusMessage(string msg)
        {
            ViewBag.Message = msg;
            return View();
        }

 

        protected ActionResult GoFinal(string msg)
        {
            return RedirectToAction("Final", "Home", new { m = msg });
        }

        public ActionResult Final(string m)
        {
            string title = "";
            string message = "";
            switch (m)
            {
                case "building-ok":
                    title = "עדכון בניין";
                    message = "הבניין עודכן בהצלחה";
                    break;
                case "unit-ok":
                    title = "עדכון נכס";
                    message = "הנכס עודכן בהצלחה";
                    break;
                case "customer-del":
                    title = "הסרת לקוח";
                    message = "הלקוח הוסר מהמערכת";
                    break;
            }
            var model = new ResultModel() { Title = title, Message = message };
            //TempData["resultModel"] = model;
            return View(model);
        }

        protected ActionResult GoWarn(string msg, string error)
        {
            return RedirectToAction("Warn", "Home", new { m = msg, err = error });
        }

        public ActionResult Warn(string m, string err)
        {
            string title = "";
            string message = "";
            switch (m)
            {
                case "building-error":
                    title = "עדכון בניין";
                    message = "אירעה שגיאה, הבניין לא עודכן." + " " + err;
                    break;
                case "unit-error":
                    title = "עדכון נכס";
                    message = "אירעה שגיאה, הנכס לא עודכן." + " " + err;
                    break;
            }
            var model = new ResultModel() { Title = title, Message = message };
            //TempData["resultModel"] = model;
            return View(model);
        }

        protected ActionResult GoPrompt(int res, string action, string reason, int outputIdentity)
        {
            var model = GetFormResult(res, action, reason, outputIdentity); 
            TempData["resultModel"] = model;
            return RedirectToAction("_Prompt","Common");
        }

        protected ResultModel GetFormResult(int res, string action, string reason, int outputIdentity)
        {
            string title = "";
            string message = "";
            //string linkFormat = "<a herf=\"{0}\" title=\"{1}\">{2}</a>";
            string buttonTrigger = "<input type=\"button\" id=\"btnTrigger\" value=\"המשך\"/>";
            string link = "";

            if (res > 1) res = 1;

            if (action == null)
            {
                switch (res)
                {
                    case 1: title = "עדכון נתונים"; message = "עודכן בהצלחה"; break;
                    case 0: title = "לא בוצע עדכון"; message = "לא נמצאו נתונים לעדכון"; break;
                    case -1: title = "אירעה שגיאה, לא בוצע עדכון."; message = reason; break;
                }

            }
            else
            {
                switch (res)
                {
                    case 1: title = string.Format("עדכון {0}", action); message = string.Format("{0} עודכן בהצלחה", action); break;
                    case 0: title = string.Format("{0} לא עודכן", action); message = string.Format("לא נמצאו נתונים לעדכון", action); break;
                    case -1: title = string.Format("אירעה שגיאה, {0} לא עודכן.", action); message = reason; break;
                }
            }
            if (res > 0)
            {
                link = buttonTrigger;
            }
            var model = new ResultModel() { Status = res, Title = title, Message = message, Link = link, OutputId = outputIdentity };
            return model;
        }

        //protected ResultModel GetFormResult(int res, string action, string reason,int outputIdentity)
        //{
        //    string title = "";
        //    string message = "";
        //    //string linkFormat = "<a herf=\"{0}\" title=\"{1}\">{2}</a>";
        //    string buttonTrigger = "<input type=\"button\" id=\"btnTrigger\" value=\"המשך\"/>";
        //    string link = "";

        //    switch (action)
        //    {
        //        case "building":
        //            switch (res)
        //            {
        //                case 1: title = "עדכון בניין"; message = "הבניין עודכן בהצלחה"; break;
        //                case 0: title = "הבניין לא עודכן"; message = "לא נמצאו נתונים לעדכון"; break;
        //                case -1: title = "אירעה שגיאה, הבניין לא עודכן."; message = reason; break;
        //            }
        //            break;
        //        case "unit":
        //            switch (res)
        //            {
        //                case 1: title = "עדכון נכס"; message = "הנכס עודכן בהצלחה"; break;
        //                case 0: title = "הנכס לא עודכן"; message = "לא נמצאו נתונים לעדכון"; break;
        //                case -1: title = "אירעה שגיאה, הנכס לא עודכן."; message = reason; break;
        //            }
        //            break;
        //        case "lead":
        //            switch (res)
        //            {
        //                case 1: title = "עדכון לקוח"; message = "הלקוח עודכן בהצלחה"; break;
        //                case 0: title = "הלקוח לא עודכן"; message = "לא נמצאו נתונים לעדכון"; break;
        //                case -1: title = "אירעה שגיאה, הלקוח לא עודכן."; message = reason; break;
        //            }
        //            break;
        //        case "account":
        //            switch (res)
        //            {
        //                case 1: title = "עדכון חשבון"; message = "החשבון עודכן בהצלחה"; break;
        //                case 0: title = "החשבון לא עודכן"; message = "לא נמצאו נתונים לעדכון"; break;
        //                case -1: title = "אירעה שגיאה, החשבון לא עודכן."; message = reason; break;
        //            }
        //            break;
        //        case "contact":
        //            switch (res)
        //            {
        //                case 1: title = "עדכון איש קשר"; message = "איש הקשר עודכן בהצלחה"; break;
        //                case 0: title = "איש הקשר לא עודכן"; message = "לא נמצאו נתונים לעדכון"; break;
        //                case -1: title = "אירעה שגיאה, איש הקשר לא עודכן."; message = reason; break;
        //            }
        //            break;
        //        case "news":
        //            switch (res)
        //            {
        //                case 0: title = "קבוצת הדיוור לא עודכנה"; message = "לא נמצאו נתונים לעדכון"; break;
        //                case -1: title = "אירעה שגיאה, קבוצת הדיוור לא עודכנה."; message = reason; break;
        //                default: title = "עדכון קבוצת הדיוור"; message = "קבוצת הדיוור עודכנה בהצלחה"; break;
        //            }
        //            break;
        //        default:
        //            switch (res)
        //            {
        //                case 1: title = "עדכון נתונים"; message = "עודכן בהצלחה"; break;
        //                case 0: title = "לא בוצע עדכון"; message = "לא נמצאו נתונים לעדכון"; break;
        //                case -1: title = "אירעה שגיאה, לא בוצע עדכון."; message = reason; break;
        //            }
        //            break;
        //    }
        //    if (res > 0)
        //    {
        //        link = buttonTrigger;// string.Format(linkFormat, "/Home/Main", title, "המשך");
        //    }
        //    var model = new ResultModel() { Status = res, Title = title, Message = message, Link = link, OutputId=outputIdentity };
        //    return model;
        //}

        protected ActionResult PromptResult(string title, string reason)
        {
            var model = new ResultModel() { Title = title, Message = reason };
            TempData["resultModel"] = model;
            return RedirectToAction("_Prompt", "Common");
        }

        //protected override void OnException(ExceptionContext filterContext)
        //{
        //    base.OnException(filterContext);

        //    Exception e = filterContext.Exception;

        //    TraceHelper.TraceError(e);

        //    //Log Exception e
        //    //filterContext.ExceptionHandled = true;
        //    //filterContext.Result = new ViewResult()
        //    //{
        //    //    ViewName = "Error"
        //    //};
        //}

        public ActionResult _Prompt()
        {
            ResultModel model = (ResultModel)TempData["resultModel"];
            return PartialView(model);
        }

        #region errors
        public ViewResult ErrorNotFound()
        {
            ViewBag.Message = string.Format("{0} : {1}", "שגיאה אירעה ב", Request["aspxerrorpath"]);
            Response.StatusCode = 200;// 404;  //you may want to set this to 200
            return View();
        }


        protected string GetAllErrors()
        {
            string messages = string.Join("; ", ModelState.Values
                                              .SelectMany(x => x.Errors)
                                              .Select(x => x.ErrorMessage));
            return messages;
        }
        public ViewResult Error()
        {
            ViewBag.Message = string.Format("{0} : {1}", "שגיאה אירעה ב", Request["aspxerrorpath"]);
            Response.StatusCode = 200;// 500;  //you may want to set this to 200
            return View();
        }
        protected override void OnException(ExceptionContext filterContext)
        {
            // Bail if we can't do anything; app will crash.
            if (filterContext == null)
                return;
            // since we're handling this, log to elmah

            var ex = filterContext.Exception ?? new Exception("No further information exists.");
            TraceHelper.Log("Application", "OnException", ex.Message, Request, 500);

            filterContext.ExceptionHandled = true;
            //filterContext.Result = new ViewResult()
            //{
            //    ViewName = "Error"
            //};

            //var data = new ErrorPresentation
            //{
            //    ErrorMessage = HttpUtility.HtmlEncode(ex.Message),
            //    TheException = ex,
            //    ShowMessage = !(filterContext.Exception == null),
            //    ShowLink = false
            //};
            //filterContext.Result = View("ErrorPage", data);
        }
        //protected override void OnException(ExceptionContext filterContext)
        //{
        //    base.OnException(filterContext);

        //    Exception e = filterContext.Exception;

        //    //TraceHelper.TraceError(e);

        //    TraceHelper.Log("Application", "OnException", e.Message, Request, 100);

        //    //Log Exception e
        //    //filterContext.ExceptionHandled = true;
        //    //filterContext.Result = new ViewResult()
        //    //{
        //    //    ViewName = "Error"
        //    //};
        //}
        #endregion

        #region Cache
        public enum CacheGroup
        {
            All,
            Ads,
            Building,
            BuildingUnit,
            Plots,
            Accounts,
            Crm,
            Props,
            Users,
            Query,
            Property,
            LeadProperty,

            Leads,
            Transaction
        }

        public enum CacheUserGroup
        {
            All
            //LeadProperties
        }

        protected void CacheRemove(string key,CacheGroup group)
        {
            if (key != null)
            {
                HttpContext.Cache.Remove(key);
                CacheRemove(group);
            }
        }
        protected void CacheAdd(string key, object o, CacheGroup group,int minutes = 3)
        {
            if (o != null)
            {
                HttpContext.Cache.Add(key, o, null, Cache.NoAbsoluteExpiration, TimeSpan.FromMinutes(minutes), CacheItemPriority.Normal, null);
                CacheAdd(group);
            }
        }

        protected bool CacheExists(CacheGroup group)
        {
            return HttpContext.Cache[group.ToString()] != null;
        }
        protected void CacheRemove(CacheGroup group)
        {
            if (group == CacheGroup.All)
                foreach (var e in Enum.GetValues(typeof(CacheGroup)))
                {
                    HttpContext.Cache.Remove(((CacheGroup)e).ToString());
                }
            else
            {
                HttpContext.Cache.Remove(group.ToString());
            }
        }
        protected void CacheRemove(CacheGroup group, CacheGroup alter)
        {
            if (group == CacheGroup.All)
                foreach (var e in Enum.GetValues(typeof(CacheGroup)))
                {
                    HttpContext.Cache.Remove(((CacheGroup)e).ToString());
                }
            else
            {
                HttpContext.Cache.Remove(group.ToString());
                HttpContext.Cache.Remove(alter.ToString());
            }
        }
       
        protected void CacheAdd(CacheGroup group, int minutes = 10)
        {
            if (group != CacheGroup.All)
                HttpContext.Cache.Add(group.ToString(), group, null, Cache.NoAbsoluteExpiration, TimeSpan.FromMinutes(minutes), CacheItemPriority.Normal, null);
        }

        protected object CacheGet(string key, CacheGroup group)
        {
            if (key == null)
            {
                return null;
            }
            if (!CacheExists(group))
                return null;
            return HttpContext.Cache[key];
        }

        //cache user

        protected object CacheUserGet(string key, CacheUserGroup group, int userId)
        {
            if (key == null)
            {
                return null;
            }
            if (!CacheUserExists(group, userId))
                return null;
            return HttpContext.Cache[key];
        }
        protected bool CacheUserExists(CacheUserGroup group, int userId)
        {
            return HttpContext.Cache[group.ToString()] != null;
        }
        protected void CacheUserAdd(string key, object o, CacheUserGroup group, int userId, int minutes = 3)
        {
            if (o != null)
            {
                HttpContext.Cache.Add(key, o, null, Cache.NoAbsoluteExpiration, TimeSpan.FromMinutes(minutes), CacheItemPriority.Normal, null);
                CacheUserAdd(group, userId);
            }
        }
        protected void CacheUserAdd(CacheUserGroup group, int userId, int minutes = 10)
        {
            if (group != CacheUserGroup.All)
                HttpContext.Cache.Add(CacheUserName(group,userId), group, null, Cache.NoAbsoluteExpiration, TimeSpan.FromMinutes(minutes), CacheItemPriority.Normal, null);
        }
        protected void CacheUserRemove(CacheUserGroup group, int userId)
        {
            if (group == CacheUserGroup.All)
                foreach (var e in Enum.GetValues(typeof(CacheGroup)))
                {
                    HttpContext.Cache.Remove(CacheUserName((CacheUserGroup)e, userId));
                }
            else
                HttpContext.Cache.Remove(CacheUserName(group, userId));
        }

        protected string CacheUserName(CacheUserGroup group, int userId)
        {
            return string.Format("{0}_{1}", group.ToString(), userId);
        }

        #endregion

        protected JsonResult QueryPager<T>(IEnumerable<T> list,int pagesize, int pagenum)
        {
            int agentId = GetUser();

            if (list == null)
            {
                return null;
            }
            int count = list.Count();
            if (pagesize > 0)
                list = list.Skip(pagesize * pagenum).Take(pagesize);
            var result = new
            {
                AgentId = agentId,
                TotalRows = count,
                Rows = list
            };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
      
        protected JsonResult QueryPagerServer<T>(IEnumerable<T> list, int totalRows, int pagesize, int pagenum)
        {
            int agentId = GetUser();

            //if (list == null)
            //{
            //    return null;
            //}
            var result = new
            {
                AgentId = agentId,
                TotalRows = totalRows,
                Rows = list
            };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
       
        protected IEnumerable<T> Sort<T>(IEnumerable<T> collection, string sortField, string sortOrder)
        {
            if (sortOrder == "asc")
            {
                collection = collection.OrderBy(c => c.GetType().GetProperty(sortField).GetValue(c, null));
            }
            else
            {
                collection = collection.OrderByDescending(c => c.GetType().GetProperty(sortField).GetValue(c, null));
            }
            return collection;
        }
        /*
       protected string BuildQuery(System.Collections.Specialized.NameValueCollection query)
       {
           string queryString = ""
           + "  SELECT *, ROW_NUMBER() OVER (ORDER BY " + query.GetValues("sortdatafield")[0] + " "
           + query.GetValues("sortorder")[0].ToUpper() + ") as row FROM Customers "
           + " ";
           var filtersCount = int.Parse(query.GetValues("filterscount")[0]);
           var where = "";
           if (filtersCount > 0)
           {
               where += " WHERE (" + this.BuildFilters(filtersCount, query);
           }
           queryString += where;
           return queryString;
       }
       protected string BuildFilters(int filtersCount, System.Collections.Specialized.NameValueCollection query)
       {
           var tmpDataField = "";
           var where = "";
           var tmpFilterOperator = "";
           for (var i = 0; i < filtersCount; i += 1)
           {
               var filterValue = query.GetValues("filtervalue" + i)[0];
               var filterCondition = query.GetValues("filtercondition" + i)[0];
               var filterDataField = query.GetValues("filterdatafield" + i)[0];
               var filterOperator = query.GetValues("filteroperator" + i)[0];
               if (tmpDataField == "")
               {
                   tmpDataField = filterDataField;
               }
               else if (tmpDataField != filterDataField)
               {
                   where += ") AND (";
               }
               else if (tmpDataField == filterDataField)
               {
                   if (tmpFilterOperator == "")
                   {
                       where += " AND ";
                   }
                   else
                   {
                       where += " OR ";
                   }
               }
               // build the "WHERE" clause depending on the filter's condition, value and datafield.
               where += this.GetFilterCondition(filterCondition, filterDataField, filterValue);
               if (i == filtersCount - 1)
               {
                   where += ")";
               }
               tmpFilterOperator = filterOperator;
               tmpDataField = filterDataField;
           }
           return where;
       }
       protected string GetFilterCondition(string filterCondition, string filterDataField, string filterValue)
       {
           switch (filterCondition)
           {
               case "NOT_EMPTY":
               case "NOT_NULL":
                   return " " + filterDataField + " NOT LIKE '" + "" + "'";
               case "EMPTY":
               case "NULL":
                   return " " + filterDataField + " LIKE '" + "" + "'";
               case "CONTAINS_CASE_SENSITIVE":
                   return " " + filterDataField + " LIKE '%" + filterValue + "%'" + " COLLATE SQL_Latin1_General_CP1_CS_AS";
               case "CONTAINS":
                   return " " + filterDataField + " LIKE '%" + filterValue + "%'";
               case "DOES_NOT_CONTAIN_CASE_SENSITIVE":
                   return " " + filterDataField + " NOT LIKE '%" + filterValue + "%'" + " COLLATE SQL_Latin1_General_CP1_CS_AS"; ;
               case "DOES_NOT_CONTAIN":
                   return " " + filterDataField + " NOT LIKE '%" + filterValue + "%'";
               case "EQUAL_CASE_SENSITIVE":
                   return " " + filterDataField + " = '" + filterValue + "'" + " COLLATE SQL_Latin1_General_CP1_CS_AS"; ;
               case "EQUAL":
                   return " " + filterDataField + " = '" + filterValue + "'";
               case "NOT_EQUAL_CASE_SENSITIVE":
                   return " BINARY " + filterDataField + " <> '" + filterValue + "'";
               case "NOT_EQUAL":
                   return " " + filterDataField + " <> '" + filterValue + "'";
               case "GREATER_THAN":
                   return " " + filterDataField + " > '" + filterValue + "'";
               case "LESS_THAN":
                   return " " + filterDataField + " < '" + filterValue + "'";
               case "GREATER_THAN_OR_EQUAL":
                   return " " + filterDataField + " >= '" + filterValue + "'";
               case "LESS_THAN_OR_EQUAL":
                   return " " + filterDataField + " <= '" + filterValue + "'";
               case "STARTS_WITH_CASE_SENSITIVE":
                   return " " + filterDataField + " LIKE '" + filterValue + "%'" + " COLLATE SQL_Latin1_General_CP1_CS_AS"; ;
               case "STARTS_WITH":
                   return " " + filterDataField + " LIKE '" + filterValue + "%'";
               case "ENDS_WITH_CASE_SENSITIVE":
                   return " " + filterDataField + " LIKE '%" + filterValue + "'" + " COLLATE SQL_Latin1_General_CP1_CS_AS"; ;
               case "ENDS_WITH":
                   return " " + filterDataField + " LIKE '%" + filterValue + "'";
           }
           return "";
       }
       */
        protected ContentResult GetJsonResult(string json)
        {
            var content = new ContentResult { Content = json, ContentType = "application/json" };
            return content;
        }

        /*
        protected new JsonResult Json(object data)
        {
            if (!Request.AcceptTypes.Contains("application/json"))
                return base.Json(data, "text/plain");
            else
                return base.Json(data);
        }
        protected new JsonResult Json(object data, JsonRequestBehavior behavior)
        {
            if (!Request.AcceptTypes.Contains("application/json"))
                return base.Json(data, "text/plain");
            else
                return base.Json(data, behavior);
        }
        */
    }
}