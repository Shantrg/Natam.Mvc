using Pro.Data.Entities;
using Natam.Mvc.Models;
using Nistec.Data.Entities;
using Nistec.Generic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Nistec;
using Pro.Models;
using Nistec.Web.Controls;

namespace Natam.Mvc.Controllers
{
    [Authorize]
    public class CommonController : BaseController
    {
      
        #region AccountInfo

        [HttpPost]
        public JsonResult GetAccountInfo(int id)
        {
            var view = AccountContext.Get(id);
            string title = "פרטים";
            switch (view.AccountType)
            {
                case 2:
                    title = "בעלים"; break;
                case 6:
                    title = "חברת ניהול"; break;
            }
            var model = new InfoModel() { Id = id, Title = title, Value = view.ToHtml() };
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AccountValidate(int AccountType,string AccountName, string ContactName, string CellPhone)
        {
            var result= AccountContext.ValidateNewAccount(AccountType, AccountName, ContactName, CellPhone);
            return Json(result, JsonRequestBehavior.AllowGet);
        }



        [HttpGet]
        public ActionResult _AccountNews(int id)
        {
            return PartialView();
        }

        [HttpGet]
        public ActionResult _AccountInfo(int id)
        {
            return PartialView();
        }
        
        [HttpGet]
        public ActionResult _Contacts(int id, int role,string uk)
        {
            return PartialView();
        }

        [HttpGet]
        public ActionResult _AccountEdit(int id, int acctype)
        {
            return PartialView();
        }
        [HttpGet]
        public ActionResult _AccountEditNew(int acctype)
        {
            return PartialView();
        }
        [HttpGet]
        public ActionResult _TenantEdit(int id, int acctype)
        {
            return PartialView();
        }
        [HttpGet]
        public ActionResult _InvestmentEdit(int id, int bid, int uid)
        {
            return PartialView();
        }


        [HttpPost]
        public JsonResult GetAccountEdit(int id, int acctype)
        {
            AccountView view = null;
            if (id > 0)
                view = AccountContext.Get(id);
            else
            {
                view = new AccountView() { AccountType = acctype };
            }
            return Json(view, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        public JsonResult UpdateAccount()
        {

            int res = 0;
            int aid = 0;
            string action = "הגדרת לקוח";
            //AccountView a = null;
            AccountContactView a = null;
            try
            {
                aid = Request.Form.Get<int>("AccountId");

               
                a = EntityContext.Create<AccountContactView>(Request.Form);
                //a = EntityContext.Create<AccountView>(Request.Form);
                string uploadKey = null;
                string key = null;

                if (a.AccountType == 2)
                {
                    key = CacheKeys.GetOwnerView;
                    action = "הגדרת בעלים";
                }
                else if (a.AccountType == 6)
                {
                    key = CacheKeys.GetManagementView;
                    action = "הגדרת חברת ניהול";
                }
                else if (a.AccountType == 4)
                {
                    action = "הגדרת דייר";
                    key = CacheKeys.GetTenantView;
                }
                else if (a.AccountType == 1)
                {
                    key = CacheKeys.GetCustomerView;
                    action = "הגדרת לקוח";
                }
                if (key == null)
                    CacheRemove(CacheGroup.Accounts);
                else
                    CacheRemove(key, CacheGroup.Accounts);

                EntityValidator validator = EntityValidator.ValidateEntity(a, action, "he");
                if (!validator.IsValid)
                {
                    //return GoPrompt(-1, "account", validator.Result);
                    return Json(GetFormResult(-1, action, validator.Result, a.AccountId), JsonRequestBehavior.AllowGet);

                }

                if (aid == 0)
                    res = AccountContext.DoSaveNew(a);
                else
                    res = AccountContext.DoSave(aid, uploadKey, a);

                return Json(FormResult.GetFormResult(res, action, a.AccountId), JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                //return GoPrompt(-1, "account", ex.Message);

                if (ex.Message.ToLower().Contains("cannot insert duplicate key"))
                    return Json(GetFormResult(-1, action, DuplicateErrorMessage(a.AccountType), a.AccountId), JsonRequestBehavior.AllowGet);
                else
                    return Json(GetFormResult(-1, action, ex.Message, a.AccountId), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        public JsonResult UpdateNewAccount()
        {

            int res = 0;
            string action = "הגדרת לקוח";
            AccountContactView a = null;
            try
            {
                a = EntityContext.Create<AccountContactView>(Request.Form);

                //if (a.AccountType <= 2)
                //{

                //    var listMatch= AccountContext.ViewByFilter(a.AccountName, a.ContactName, a.ContactMobile, a.AccountType);
                //    if (listMatch != null && listMatch.Count() > 0)
                //    {
                //        return Json(listMatch, JsonRequestBehavior.AllowGet);
                //    }
                //}

                string key = null;

                if (a.AccountType == 2)
                    key = CacheKeys.GetOwnerView;
                else if (a.AccountType == 6)
                    key = CacheKeys.GetManagementView;
                else if (a.AccountType == 4)
                    key = CacheKeys.GetTenantView;
                else if (a.AccountType == 1)
                    key = CacheKeys.GetCustomerView;

                if (key == null)
                    CacheRemove(CacheGroup.Accounts);
                else
                    CacheRemove(key, CacheGroup.Accounts);

                EntityValidator validator = EntityValidator.ValidateEntity(a, "הגדרת חשבון", "he");
                if (!validator.IsValid)
                {
                    //return GoPrompt(-1, "account", validator.Result);
                    return Json(GetFormResult(-1, action, validator.Result, a.AccountId), JsonRequestBehavior.AllowGet);

                }

                res = AccountContext.DoSaveNew(a);
                return Json(FormResult.GetFormResult(res, action, a.AccountId), JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                //return GoPrompt(-1, "account", ex.Message);

                if (ex.Message.ToLower().Contains("cannot insert duplicate key"))
                    return Json(GetFormResult(-1, action, DuplicateErrorMessage(a.AccountType), a.AccountId), JsonRequestBehavior.AllowGet);
                else
                    return Json(GetFormResult(-1, action, ex.Message, a.AccountId), JsonRequestBehavior.AllowGet);
            }
        }
        string DuplicateErrorMessage(int AccountType)
        {
            if (AccountType == 2)
                return "שם בעלים כבר קיים במערכת";
            else if (AccountType == 6)
                return "שם חברת ניהול כבר קיים במערכת";
            else if (AccountType == 4)
                return "שם חברה כבר קיים במערכת";
            else if (AccountType == 1)
                return "שם לקוח כבר קיים במערכת";
            else
                return "שם חשבון כבר קיים במערכת";
        }

        #endregion

        #region ContactsInfo
        [HttpGet]
         public ActionResult _ContactEdit(int id, int pid, int op, string uk)
        {
            //op ? 'contact'|'buildingcontact'
            return PartialView();
        }

        [HttpPost]
        public JsonResult GetContactEdit(int id, int pid, int op, string uk)
        {
            ContactView view = null;
            if (id > 0)
                view = ContactContext.Get(id);
            else
            {
                //var role = op == "buildingcontact" ? 1 : 0;
                if (uk == null || uk.Length < 30)
                    uk = null;
                bool isna = pid == 0 && uk != null;
                view = new ContactView() { ParentId = pid, Role = op, UploadKey = uk, IsNA = isna };
            }
            return Json(view, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        public JsonResult UpdateContact()
        {

            int res = 0;
            int cid = 0;
            string action = "הגדרת איש קשר";
            ContactView c = null;
            try
            {
                cid = Request.Form.Get<int>("ContactId");
                c = EntityContext.Create<ContactView>(Request.Form);
                string key=null;
                if(c.Role!=0)
                    key = CacheKeys.GetContactByRole(c.Role);
                else
                    key = CacheKeys.GetContactView(c.ParentId);

                CacheRemove(key, CacheGroup.Accounts);

                EntityValidator validator = EntityValidator.ValidateEntity(c, "הגדרת איש קשר", "he");
                if (!validator.IsValid)
                {
                    return Json(GetFormResult(-1, action, validator.Result,c.ContactId), JsonRequestBehavior.AllowGet);

                    //return GoPrompt(-1, "contact", validator.Result);
                }

                res = ContactContext.DoSave(cid, c);

                var model = new ResultModel() { Status = res, Title = "אנשי קשר", Message = "איש הקשר עודכן בהצלחה", Link = null, OutputId = c.ContactId };
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                //Cannot insert duplicate key row in object 'dbo.Crm_Contacts' with unique index 'IX_Crm_Contacts_Name'.The statement has been terminated.
                if (ex.Message.Contains("duplicate key"))
                    message = "איש קשר קיים עם שם זהה!";

                //return GoPrompt(-1, "contact", ex.Message);
                return Json(GetFormResult(-1, action, message, c.ContactId), JsonRequestBehavior.AllowGet);
            }
        }

        #endregion

        #region Lead Property


        public ActionResult _LeadPropertyGrid(int id)
        {
            return PartialView(id);
        }

        public ActionResult _TransWizard4Buyer(int id)
        {
            return PartialView(id);
        }
        public ActionResult _TransWizard4Seller(int id)
        {
            return PartialView(id);
        }
        public ActionResult _TransWizard4Advice(int id)
        {
            return PartialView(id);
        }

        #endregion

        #region Property


        public ActionResult _PropertyDef(int id,int pid,int pt)
        {
            return PartialView();
        }

        public ActionResult _PropertyGrid(int id, int qt, string dt, string pt, string at, string rs)
        {
            int agetntId = GetUser();
            if (rs != null)
                rs = rs.Replace("%", "+");
            PropertyQuery model = new PropertyQuery() { ParentId = id, PropertyType = qt, AgentId = agetntId, AreaType = at, DealType = dt, PurposeType = pt, RequestSize = rs };
            return PartialView(model);
        }

           
        [HttpPost]
        public JsonResult GetPropertyGrid(int PropertyType, int ParentId, string DealType, string PurposeType, string AreaType, string RequestSize)
        {
            int AgentId = GetUser(); //Types.ToInt(Request.Form["Agent"]);
            if (RequestSize != null)
                RequestSize = RequestSize.Replace("%", "+");
            string key = CacheKeys.GetPropertyGrid(PropertyType,ParentId, AgentId, DealType, PurposeType, AreaType, RequestSize);
            //string key = CacheKeys.GetPropertyGrid(PropertyType, ParentId);

            IEnumerable<PropertyInfoView> list =  (IEnumerable<PropertyInfoView>)CacheGet(key, CacheGroup.Property);

            if (list == null)
            {
                list = PropertyView.QueryProperty(PropertyType, ParentId,AgentId, DealType, PurposeType, AreaType, RequestSize);
                if (list != null && list.Count() > 0)
                {
                    CacheAdd(key, list, CacheGroup.Property);
                }
            }
            
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult GetProperty(int id)
        {
            UnitView info = id > 0 ? UnitContext.Get(id) : new UnitView();
            return Json(info, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        public ActionResult UpdateProperty()
        {

            int res = 0;
            string action = "הגדרת יחידה";
            PropertyView v = null;
            try
            {
                v = EntityContext.Create<PropertyView>(Request.Form);
                v.AgentId = GetUser();
                v.BuildingId = 0;

                //string key = CacheKeys.GetPropertyGrid(1, v.AgentId,, v.FloorNum, v.PropertyType);
                //CacheRemove(key, CacheGroup.Building);
                CacheRemove(CacheGroup.Property, CacheGroup.LeadProperty);

                //EntityValidator validator = EntityValidator.ValidateEntity(v, "הגדרת נכס", "he");
                //if (!validator.IsValid)
                //{
                //    return Json(GetFormResult(-1, action, validator.Result, v.UnitId), JsonRequestBehavior.AllowGet);
                //}

                res = PropertyView.DoSave(v);
                if (res < 0)
                {
                    var model = new ResultModel() { Status = res, Title = action, Message = "אירעה שגיאה,הנכס לא עודכן", OutputId = v.UnitId };
                    return Json(model, JsonRequestBehavior.AllowGet);
                }

                return Json(FormResult.GetFormResult(res, action, v.UnitId), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(GetFormResult(-1, action, ex.Message, v.UnitId), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        public JsonResult DeleteProperty(int UnitId)
        {

            int res = 0;
            string action = "מחיקת נכס";
            ResultModel model = null;
            try
            {
                //string key = CacheKeys.GetUnitGrid(BuildingId, FloorNum, 2);
                //CacheRemove(key, CacheGroup.Building);
                CacheRemove(CacheGroup.Property, CacheGroup.LeadProperty);

                var userId = GetUser();
                res = UnitContext.DoDelete(UnitId, userId);
                //if (res == -2)
                //    model = new ResultModel() { Status = res, Title = action, Message = "שטח היחידה חורג משטח הקומה", OutputId = UnitId };
                if (res == -3)
                    model = new ResultModel() { Status = res, Title = action, Message = "אין הרשאה למחיקת נכס", OutputId = UnitId };
                else if (res == -1)
                    model = new ResultModel() { Status = res, Title = action, Message = "אירעה שגיאה הנכס לא הוסר", OutputId = UnitId };
                else
                    model = new ResultModel() { Status = res, Title = action, Message = "הנכס הוסר", OutputId = UnitId };
            }
            catch (Exception ex)
            {
                model = new ResultModel() { Status = -1, Title = action, Message = "אירעה שגיאה " + ex.Message, OutputId = UnitId };
            }
            return Json(model, JsonRequestBehavior.AllowGet);
        }
        #endregion
        
        #region Ws

        [HttpPost]
        public string GetAccountDetails(string id)
        {
            int accountId = Types.ToInt(id);
            if (accountId <= 0)
                return "";
            var entity = AccountContext.Get(accountId);
            if (entity == null)
                return "";
            return entity.ToHtml();
        }
        [HttpPost]
        public string GetContactDetails(string id)
        {
            int contactId = Types.ToInt(id);
            if (contactId <= 0)
                return "";
            var entity = ContactView.Get(contactId);
            if (entity == null)
                return "";
            return entity.ToHtml();
        }

        [HttpPost]
        public string GetOwnerDetails(string id)
        {
            int accountId = Types.ToInt(id);
            if (accountId <= 0)
                return "";
            var entity = AccountContext.Get(accountId);
            if (entity == null)
                return "";
            return entity.ToHtml();
        }

        [HttpPost]
        public int ContactDelete(string id)
        {
            int contactId = Types.ToInt(id);
            if (contactId <= 0)
                return 0;
            return ContactContext.DoDelete(contactId);
        }

        [HttpPost]
        public int AccountDelete(string id)
        {
            int accountId = Types.ToInt(id);
            if (accountId <= 0)
                return 0;
            return AccountContext.DoDelete(accountId);
        }

        [HttpPost]
        public string ValidateLeadAccountName(string name)
        {
            int userId = GetUser();
            string result= LeadsContext.Validate_CustomerName(name,userId);

            return result;
        }

        [HttpPost]
        public int AccountNewsDelete(int AccountId, int NewsId)
        {
            if (AccountId <= 0 || NewsId <= 0)
                return 0;
            return AccountNewsView.DeleteNews(AccountId, NewsId);
        }
        #endregion

        #region leads transfer
        public ActionResult _LeadTransfer(int id)
        {
            return PartialView();
        }
        
        [HttpPost]
        // [ValidateAntiForgeryToken]
        public JsonResult TransferLead()
        {

            //int newid = 0;
            string action = "העברת לקוח";
            string message = "";
            try
            {

                int leadid = Request.Form.Get<int>("LeadId");
                string TransferTo = Request.Form.Get("TransferTo");
                bool EnableEmail = Request.Form.Get<bool>("EnableEmail");
                
                var returnValue=LeadsContext.Leads_Transfer(leadid, TransferTo, EnableEmail);

                CacheRemove(CacheGroup.Leads, CacheGroup.Accounts);

                if(returnValue>0)
                    message = "הלקוח כולל כל הפרטים הנלווים הועברו";
                else if (returnValue == -1)
                     message= "נתונים שגויים, פרטי הסוכן המיועד אינם תקינים";
                else
                     message= "אירעה שגיאה, הנתונים לא הועברו";

                    //string key = CacheKeys.GetLeadsView(agentid);
                    //CacheRemove(key, CacheGroup.Accounts);

                    ////newid = LeadsContext.Leads_Transfer(leadid, TransferTo, EnableEmail);

                    //if (newid > 0)
                    //    message= "הלקוח כולל כל הפרטים הנלווים הועברו";
                    //if (newid == -1)
                    //    message= "נתונים שגויים, פרטי הסוכן המיועד אינם תקינים";
                    //if (newid == -2)
                    //    message= "נתונים שגויים, הלקוח או הסוכן המיועד אינם תקינים";
                    //else
                    //    message= "אירעה שגיאה, הנתונים לא הועברו";

                    return Json(GetFormResult(returnValue, action, message, 0), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                message = ex.Message;
                return Json(GetFormResult(-1, action, message, 0), JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public ContentResult GetAgentTransferList()
        {
            var agentId = GetUser();
            var view = AccountContext.GetAgentListJson(agentId);
            return GetJsonResult(view);
        }
        [HttpPost]
        public JsonResult GetAgentName(int id)
        {
            var result = AccountContext.LookupAgentName(id);
            //return GetJsonResult(result);// GetJsonResult(result);
            return Json(result);
        }
        #endregion

        #region leads tracking

        
        [HttpGet]
        public ActionResult _LeadReminder()
        {
            return PartialView();
        }
        [HttpPost]
        public ContentResult GetLeadReminder()
        {
            var uid = GetUser();
            var json = LeadsTrackingContext.ViewLeadsReminder(uid);
            return base.GetJsonResult(json);
        }

        [HttpPost]
        public JsonResult LeadReminderCompleted(int id)
        {

            int res = 0;
            string action = "סיום תזכורת";
            ResultModel model = null;
            try
            {
                var userId = GetUser();
                string key = CacheKeys.GetTraceView(userId);
                CacheRemove(key, CacheGroup.Crm);

                res = LeadsTrackingContext.DoTraceCompleted(id);

                string result = res <= 0 ? "אירעה שגיאה לא עודכנו נתונים" : "הנתונים עודכנו בהצלחה";
                return Json(GetFormResult(res, action, result, 0), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                model = new ResultModel() { Status = -1, Title = action, Message = "אירעה שגיאה " + ex.Message, OutputId = id };
                return Json(model, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult LeadReminderDelay(int id, int days)
        {

            int res = 0;
            string action = "דחיית תזכורת";
            ResultModel model = null;
            try
            {
                var userId = GetUser();
                string key = CacheKeys.GetTraceView(userId);
                CacheRemove(key, CacheGroup.Crm);

                res = LeadsTrackingContext.DoTraceDelay(id, days);

                string result = res <= 0 ? "אירעה שגיאה לא עודכנו נתונים" : "הנתונים עודכנו בהצלחה";
                return Json(GetFormResult(res, action, result, 0), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                model = new ResultModel() { Status = -1, Title = action, Message = "אירעה שגיאה " + ex.Message, OutputId = id };
                return Json(model, JsonRequestBehavior.AllowGet);
            }
        }
        

        [HttpGet]
        public ActionResult _LeadTrace(int id)
        {
            return PartialView();
        }
         [HttpPost]
        public JsonResult GetLeadsTrace(int id)
        {
            var view = LeadsTrackingContext.ViewByLead(id);
            var list = view == null ? null : view.OrderByDescending(v => v.LastUpdate).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

         //AgentId-ContactId-LeadId-LeadType-Memo-RecordId-RemindDate-State

        // Insert=0,Update=1,Delete=2,StoredProcedure=3
        [HttpPost]
         public JsonResult LeadTraceUpdate()//int AgentId, int ContactId, int LeadId, int LeadType, string Memo, int RecordId, DateTime? RemindDate, int State)
        {

                int ContactId = Types.ToInt(Request["ContactId"]);
                string Memo = Request["Memo"];
                DateTime? RemindDate = Types.ToNullableDate(Request["RemindDate"]);
                int State = Types.ToInt(Request["State"]);
                int RecordId = Types.ToInt(Request["RecordId"]);


            int res=LeadsTrackingContext.DoUpdate(RecordId, ContactId, Memo, RemindDate, State);
            string result = res <= 0 ? "אירעה שגיאה לא עודכנו נתונים" : "הנתונים עודכנו בהצלחה";
            return Json(GetFormResult(res, "עדכון שיחה", result, 0), JsonRequestBehavior.AllowGet);
        }

        // Insert=0,Update=1,Delete=2,StoredProcedure=3
        [HttpPost]
        public JsonResult LeadTraceDelete()
        {
            int RecordId = Types.ToInt(Request["RecordId"]);

            int res = LeadsTrackingContext.DoDelete(RecordId);
            string result = res <= 0 ? "אירעה שגיאה לא נמחקו נתונים" : "הנתונים נמחקו בהצלחה";
            return Json(GetFormResult(res, "מחיקת שיחה", result, 0), JsonRequestBehavior.AllowGet);
        }

        // Insert=0,Update=1,Delete=2,StoredProcedure=3
        [HttpPost]
        public JsonResult LeadTraceAdd()
        {
            //int AgentId, int ContactId, int LeadId, int LeadType, string Memo, int RecordId, DateTime? RemindDate, int State

            int agentId = GetUser();

            LeadTraceItem item = new LeadTraceItem()
            {
                LeadId = Types.ToInt(Request["LeadId"]),
                AgentId = agentId,//Types.ToInt(Request["AgentId"]),
                LeadType = Types.ToInt(Request["LeadType"]),
                ContactId = Types.ToInt(Request["ContactId"]),
                Memo = Request["Memo"],
                RemindDate = Types.ToNullableDate(Request["RemindDate"]),
                State = Types.ToInt(Request["State"]),
                RecordId = Types.ToInt(Request["RecordId"])
            };

            int res = LeadsTrackingContext.DoAdd(item);
            string result = res <= 0 ? "אירעה שגיאה לא עודכנו נתונים" : "הנתונים עודכנו בהצלחה";
            return Json(GetFormResult(res, "הוספת שיחה", result, 0), JsonRequestBehavior.AllowGet);
        }

        #endregion


        public ActionResult _AccountsGrid(int at)
        {
            AccountQuery query = new AccountQuery((AccountTypes)at);
            return PartialView(query);
        }

        [HttpPost]
        public JsonResult GetAccountNews(int accid)
        {
            var view = AccountNewsView.ViewByAccount(accid);
            return Json(view, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetNewsView()
        {
            string key = CacheKeys.GetNewsView;
            IEnumerable<NewsView> list = (IEnumerable<NewsView>)CacheGet(key, CacheGroup.Props);

            if (list == null)
            {
                list = NewsView.View();
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Props);
                }
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        public JsonResult UpdateAccountNews()
        {
            int res = 0;
            string action = "הגדרת קבוצת דיוור";
            int accid = 0;
            try
            {
                accid = Request.Form.Get<int>("AccountId");
                string newstype = Request.Form["NewsType"];
                if(accid<=0)
                {
                    return Json(GetFormResult(-1, action, "נדרש קוד לקוח",accid), JsonRequestBehavior.AllowGet);
                }

                res = AccountNewsView.UpdateNews(accid, newstype);
                return Json(FormResult.GetFormResult(res, action, accid), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(GetFormResult(-1, action, ex.Message,accid), JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public JsonResult GetCategoryView()
        {
            string key = CacheKeys.GetCategoryView;
            IEnumerable<CategoryView> list = (IEnumerable<CategoryView>)CacheGet(key, CacheGroup.Props);

            if (list == null)
            {
                list = CategoryView.View();
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Props);
                }
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ContentResult GetAdsStatus()
        {
            return GetListsView(ListsTypes.AdsStatus, CacheKeys.GetAdsStatus, CacheGroup.All);
        }
        [HttpPost]
        public ContentResult GetAdsPropertyType()
        {
            return GetListsView(ListsTypes.AdsPropertyType, CacheKeys.GetAdsPropertyType, CacheGroup.All);
        }
        [HttpPost]
        public ContentResult GetRequestSize()
        {
            return GetListsView(ListsTypes.RequestSize, CacheKeys.GetRequestSize, CacheGroup.All);
        }
        [HttpPost]
        public ContentResult GetAgentList()
        {
            return GetListsView(ListsTypes.AgentList, CacheKeys.GetAgentList, CacheGroup.All);
        }

        
        private ContentResult GetListsView(ListsTypes type, string cacheKey, CacheGroup group)
        {
            string list = (string)CacheGet(cacheKey, group);

            if (list == null)
            {
                list = Lists.GetList(type);
                if (list != null)
                {
                    CacheAdd(cacheKey, list, group);
                }
            }
            return base.GetJsonResult(list);
        }
    }
}