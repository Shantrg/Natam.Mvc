using Pro.Models;
using Pro.Data;
using Pro.Data.Entities;
using Nistec;
using Nistec.Generic;
using Nistec.Data;
using Nistec.Data.Entities;
using Nistec.Web.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Natam.Mvc.Models;

namespace Natam.Mvc.Controllers
{
    [Authorize]
    public class CrmController : BaseController
    {

        #region Leads

        public JsonResult GetLead(int id)
        {
            int uid = GetUser();
          
            var lead = id > 0 ? LeadsContext.View(id) : new LeadsView() { AgentId = uid, UploadKey=Guid.NewGuid().ToString()  };
            return Json(lead, JsonRequestBehavior.AllowGet);
        }
        
        public ActionResult LeadDef()
        {
            return Authenticate(null);
        }
        public ActionResult LeadNew()
        {
            return Authenticate(null);
        }

        //public ActionResult Leads()
        //{
        //    return View();
        //}

        //public JsonResult GetLeads()
        //{
        //    int uid = GetUser();
        //    var list = LeadsListView.ViewByAgent(uid);
        //    return Json(list, JsonRequestBehavior.AllowGet);
        //}

        public ActionResult LeadsFollow()
        {
            return Authenticate(null);
        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        public ActionResult UpdateLead()
        {

            int res = 0;
            string action="הלקוח";
            LeadsView l=null;
            try
            {
                int uid = GetUser();
                int lid = Request.Form.Get<int>("LeadId");

                l = EntityContext.Create<LeadsView>(Request.Form);
                l.LeadId = lid;
                l.AgentId = uid;
                l.LastUpdate = DateTime.Now;
                l.UploadKey = lid > 0 ? null : Request.Form.Get("UploadKey");
                if (lid == 0)
                    l.Creation = DateTime.Now;
                res = LeadsContext.DoSave(l);

                return Json(GetFormResult(res, action, null, l.LeadId), JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                //return GoPrompt(-1, "lead", ex.Message);
                return Json(GetFormResult(-1, action, ex.Message, l.LeadId), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        public JsonResult DeleteLead(int LeaId)
        {

            int res = 0;
            string action = "מחיקת לקוח";
            ResultModel model = null;
            try
            {
                var userId = GetUser();
                string key = CacheKeys.GetLeadsView(userId);
                CacheRemove(key, CacheGroup.Crm);

                res = LeadsContext.DoDelete(LeaId, userId);
                if (res == -3)
                    model = new ResultModel() { Status = res, Title = action, Message = "אין הרשאה למחיקת לקוח", OutputId = LeaId };
                else if (res == -1)
                    model = new ResultModel() { Status = res, Title = action, Message = "אירעה שגיאה הלקוח לא הוסר", OutputId = LeaId };
                else
                    model = new ResultModel() { Status = res, Title = action, Message = "הלקוח הוסרה", OutputId = LeaId };
            }
            catch (Exception ex)
            {
                model = new ResultModel() { Status = -1, Title = action, Message = "אירעה שגיאה " + ex.Message, OutputId = LeaId };
            }
            return Json(model, JsonRequestBehavior.AllowGet);
        }

         public ActionResult LeadsExport()
        {
            int agentId = GetUser();
            LeadsQuery query = new LeadsQuery(Request, agentId);
            var list = LeadsContext.ExportByQuery(query.QueryType, agentId, query.CustomerName, query.ContactName, query.DealType, query.PurposeType, query.AreaType,query.RequestSize);
            return CsvActionResult.ExportToCsv(list, "Leads");
        }
        
        public ActionResult LeadsQuery()
        {
            return View();
        }

        public ActionResult LeadsGrid()
        {
            int agentId = GetUser();
            LeadsQuery query = new LeadsQuery(Request, agentId);
            return View(query);
        }

        [HttpPost]
        public JsonResult GetLeadsGrid(int QueryType, string CustomerName, string ContactName, string DealType, string PurposeType, string AreaType, int RequestSize)
        {
            int agetntId = GetUser();
            var list = LeadsContext.ViewByQuery(QueryType, agetntId, CustomerName, ContactName, DealType, PurposeType, AreaType, RequestSize);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetLeadPropertyList(int LeadId)
        {
            int agentId = GetUser();
            //const int PropertyType = 2;//lead
            string key = CacheKeys.GetLeadProperty(LeadId);
            IEnumerable<LeadPropertyItem> list = (IEnumerable<LeadPropertyItem>)CacheGet(key, CacheGroup.LeadProperty);

            if (list == null)
            {
                list = LeadsContext.ViewLeadsPropertyList(LeadId);
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.LeadProperty);
                }
            }

            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult LeadPropertyListAdd(int LeadId, string PropertyList)
        {
            int res = 0;
            try
            {
                //const int PropertyType = 2;//lead
                string key=CacheKeys.GetLeadProperty(LeadId);
                CacheRemove(key, CacheGroup.LeadProperty);
                CacheRemove(CacheGroup.Property);
                res = LeadsContext.LeadsPropertyListAdd(LeadId, PropertyList);
            }
            catch(Exception ex)
            {
                res = -1;
            }
            return Json(res, JsonRequestBehavior.AllowGet);
        }

         [HttpPost]
        public JsonResult LeadCommentUpdate(int id,int uid, string comment)
        {
            int res = 0;
            try
            {
                //const int PropertyType = 2;//lead
                string key = CacheKeys.GetLeadProperty(id);
                //string key = CacheKeys.GetLeadPropertyList(id);
                CacheRemove(key, CacheGroup.LeadProperty);
                res = LeadsContext.LeadsPropertyListUpdate(id,uid, comment);
            }
            catch(Exception)
            {
                res = -1;
            }
            return Json(res, JsonRequestBehavior.AllowGet);
        }


         [HttpPost]
         // [ValidateAntiForgeryToken]
         public JsonResult LeadPropertyRemove(int leadId, int unitId)
         {

             int res = 0;
             string action = "הסרת נכס מרשימת הנכסים";
             ResultModel model = null;
             try
             {
                 //const int PropertyType = 2;//lead
                 string key = CacheKeys.GetLeadProperty(leadId);
                 CacheRemove(key, CacheGroup.LeadProperty);

                 res = LeadsContext.DoLeadsPropertyAction(leadId, unitId, "remove");
                 //if (res == -2)
                 //    model = new ResultModel() { Status = res, Title = action, Message = "שטח היחידה חורג משטח הקומה", OutputId = UnitId };
                 if (res <= 0)
                     model = new ResultModel() { Status = res, Title = action, Message = "אירעה שגיאה הנכס לא הוסר", OutputId = unitId };
                 else
                     model = new ResultModel() { Status = res, Title = action, Message = "הנכס הוסר", OutputId = unitId };
             }
             catch (Exception ex)
             {
                 model = new ResultModel() { Status = -1, Title = action, Message = "אירעה שגיאה " + ex.Message, OutputId = unitId };
             }
             return Json(model, JsonRequestBehavior.AllowGet);
         }

         [HttpPost]
         public JsonResult GetLead4TransList(int LeadId)
         {
             var list = LeadsContext.ViewLeads4TransPropertyList(LeadId);
             return Json(list, JsonRequestBehavior.AllowGet);
         }

       
         [HttpPost]
         public JsonResult GetContactsByLead(int LeadId)
         {
             var list = ContactInfoView.ListByParent(LeadId, 3);
             return Json(list, JsonRequestBehavior.AllowGet);
         }

         [HttpPost]
         public JsonResult GetContactsByUnitOwner(int UnitId)
         {
             int ownerId = UnitContext.Lookup_OwnerId(UnitId);
             var list = ContactInfoView.ListByParent(ownerId, 0);
             return Json(list, JsonRequestBehavior.AllowGet);
         }

         [HttpPost]
         public ContentResult GetLeadsList4Unit(int unitId)
         {
             // select LeadId,CustomerName,Address,City,ContactId,ContactName,Title,LastUpdate

             int agentId = GetUser();
             var list = LeadsContext.ViewLeads4UnitJson(agentId, unitId);
             return base.GetJsonResult(list);
             //return Json(list, JsonRequestBehavior.AllowGet);
         }

        #endregion

        #region Customers

        public ActionResult CustomersExport()
        {
            CustomerQuery query = new CustomerQuery(Request);
            var list = AccountContext.ExportByQuery(query.QueryType, query.NewsType, query.CustomerName, query.ContactName, query.AccType);
            return CsvActionResult.ExportToCsv(list, "Customers");
        }


        public ActionResult CustomerQuery()
        {
            return View();
        }

        [HttpGet]
        public ActionResult CustomerDef(int id, int acctype)
        {
            //var av= AccountView.Get(id);
            //return Authenticate(av);
            return View();
        }

        [HttpGet]
        public ActionResult Customers(int acctype)
        {
            return Authenticate(null);
        }

        public ActionResult CustomersGrid()
        {
            CustomerQuery query = new CustomerQuery(Request);
            return View(query);
        }

//                    source.data = { 'QueryType': '@Model.QueryType', 'NewsType': '@Model.NewsType', 'CustomerName': '@Model.CustomerName', 'ContactName': '@Model.ContactName', 'City': '@Model.City', 'AccType': '@Model.AccType' };

        [HttpPost]
        public JsonResult GetCustomersGrid(int QueryType, string NewsType, string CustomerName, string ContactName, int AccType)
        {
            var list = AccountContext.ViewByQuery(QueryType, NewsType, CustomerName, ContactName, AccType);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //public ActionResult CustomerQuery()
        //{
        //    return Authenticate(null);
        //}
        public ActionResult CustomerQueryGrid()
        {
            return Authenticate(null);
        }

        public ActionResult AccountsGrid(int accType)
        {
            AccountQuery query = new AccountQuery((AccountTypes)accType);
            return View(query);
        }

         [HttpPost]
        public JsonResult GetAcoountsGrid(int acctype)
        {
            var list = AccountContext.ViewByType(acctype);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

         [HttpPost]
         public JsonResult AccountDelete(int AccountId, int AccType)
         {
             int res = 0;
             string typename = AccountContext.AccountTypeStr((AccountTypes)AccType);
             ResultModel model = null;
             try
             {
                 res = AccountContext.DoDelete(AccountId);

                 model = new ResultModel() { Status = res, Title = typename, Message = typename + " הוסר מהמערכת" };

                 return Json(model, JsonRequestBehavior.AllowGet);
             }
             catch (Exception ex)
             {
                 model = new ResultModel() { Status = res, Title = typename, Message = ex.Message };

                 return Json(model, JsonRequestBehavior.AllowGet);
             }
         }


        [HttpPost]
        public JsonResult CustomerDelete(int AccountId)
        {
            int res = 0;

            ResultModel model = null;
            try
            {
                res = AccountContext.DoDelete(AccountId);

                model = new ResultModel() { Status = res, Title = "חשבונות", Message = "הלקוח הוסר מהמערכת" };

                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                model = new ResultModel() { Status = res, Title = "חשבונות", Message = ex.Message };

                return Json(model, JsonRequestBehavior.AllowGet);
            }
        }


        #endregion

        #region Accounts Nested

        public JsonResult GetContactsView(int parentId, int role, string uk)
        {
            var list = ContactView.ViewByParent(parentId, role, uk);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

       
        //public JsonResult GetAcoountContacts(int accountId)
        //{
        //    var list = ContactView.ViewByAccount(accountId);
        //    return Json(list, JsonRequestBehavior.AllowGet);
        //}

        public JsonResult GetAcoountNews(int accountId)
        {
            var list = AccountNewsView.ViewByAccount(accountId);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        #endregion

        #region Ads

        public ActionResult AdsConfirmList()
        {
            return View();
        }

        public ActionResult AdsFind()
        {
            return View();
        }
        [HttpGet]
        public ActionResult AdsGrid(int id, string op)
        {
            //if (op == "agent")
            //{
            //    if (id == 0)
            //        id = GetUser();
            //    return View(AdsPropertyView.ViewByAgent(id));
            //}
            //if (op == "property")
            //    return View(AdsPropertyView.ViewByProperty(id));
            //else
            //    return View(AdsPropertyView.ViewAll());

         
            return View();
        }

         [HttpPost]
        public JsonResult GetAdsGrid(int id, string op, int state)
        {
            if (op == "property")
            {
                IEnumerable<AdsPropertyView> list = null;

                if (list == null)
                {
                    list = AdsPropertyView.GetAdsView(AdsViewType.ViewByProperty ,id,(AdsStateView)state);
                    //if (list != null && list.Count() > 0)
                    //{
                    //    CacheAdd(key, list, CacheGroup.Ads);
                    //}
                }

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            else
            {
                int userId = GetUser();

                if (base.IsAdmin())
                {
                    string key = CacheKeys.GetAdsView(userId, state);

                    IEnumerable<AdsPropertyView> list = (IEnumerable<AdsPropertyView>)CacheGet(key, CacheGroup.Ads);

                    if (list == null)
                    {
                        list = AdsPropertyView.GetAdsView(AdsViewType.ViewAll, 0, (AdsStateView)state); 
                        if (list != null && list.Count() > 0)
                        {
                            CacheAdd(key, list, CacheGroup.Ads);
                        }
                    }
                    return Json(list, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    string key = CacheKeys.GetAdsView(userId, (int)AdsStateView.WaitAndActive);

                    IEnumerable<AdsPropertyView> list = (IEnumerable<AdsPropertyView>)CacheGet(key, CacheGroup.Ads);

                    if (list == null)
                    {
                        list = AdsPropertyView.GetAdsView(AdsViewType.ViewByAgent, userId, (AdsStateView)state); 
                        if (list != null && list.Count() > 0)
                        {
                            CacheAdd(key, list, CacheGroup.Ads);
                        }
                    }
                    return Json(list, JsonRequestBehavior.AllowGet);
                }
            }
        }
               

        public ActionResult AdsList()
        {
            return View();
        }
        //public ActionResult Advertise()
        //{
        //    return View(new AdsView());
        //}

        //[ActionName("Advertise")]
        //[HttpGet]
        //public ActionResult Advertise(int id, string op)
        //{
        //    AdsView view = null;
        //    if (op == "property")
        //    {
        //        int AgentId = Types.ToInt(Request.Form["Agent"]);
        //        if (AgentId <= 0)
        //            AgentId = GetUser();

        //        view = AdsView.Create(id, AgentId);
        //    }
        //    else if (op == "ads")
        //    {
        //        //int AgentId = Types.ToInt(Request.Form["Agent"]);
        //        //if (AgentId <= 0)
        //        //    AgentId = GetUser();
        //        view = AdsView.View(id);
        //    }
        //    else
        //    {
        //        view = new AdsView();
        //    }
        //    //var view = adsId == 0 ? new AdsView() : AdsView.View(adsId);

        //    //var view = adsId == 0 ? new AdsView() : DbNatam.Instance.GetAdsView(adsId);
        //    return View(view);
        //}

        [HttpGet]
        public ActionResult AdsDef(int id, string op)
        {
            return View();
        }

         [HttpPost]
        public JsonResult GetAds(int id, string op)
        {
            AdsView view = null;
            if (op == "u")
            {
                //int AgentId = Types.ToInt(Request.Form["Agent"]);
                //if (AgentId <= 0)
                //    AgentId = GetUser();

                int AgentId = GetUser();
                view = AdsView.Create(id,1, AgentId);
            }
            else if (op == "p")
            {
                int AgentId = GetUser();
                view = AdsView.Create(id, 3, AgentId);
            }
            else if (op == "ads")
            {
                //int AgentId = Types.ToInt(Request.Form["Agent"]);
                //if (AgentId <= 0)
                //    AgentId = GetUser();
                view = AdsView.View(id);
            }
            else
            {
                view = new AdsView();
            }

            return Json(view, JsonRequestBehavior.AllowGet);
        }

         [HttpPost]
         public JsonResult AdsDelete(int AdsId)
         {
             int res = 0;

             ResultModel model = null;
             try
             {
                 res = AdsView.DoDelete(AdsId);

                 CacheRemove(CacheGroup.Ads);

                 model = new ResultModel() { Status = res, Title = "פרסום", Message = "הפרסום הוסר מהמערכת" };

                 return Json(model, JsonRequestBehavior.AllowGet);
             }
             catch (Exception ex)
             {
                 model = new ResultModel() { Status = res, Title = "פרסום", Message = ex.Message };

                 return Json(model, JsonRequestBehavior.AllowGet);
             }
         }

        //[HttpPost]
        //public ActionResult AdsUpdate(string Description, int MediaType, string PropertyId, string Note, string AdsDate, string Status, string AgentId, string AdsId)
        //{
        //    int res = 0;
        //    string message = "";
        //    try
        //    {
        //        int id = Types.ToInt(AdsId);
        //        AdsView v = new AdsView()
        //        {
        //            AdsDate = Types.ToDateTime(AdsDate),
        //            //AdsOptions = AdsOptions,
        //            AgentId = Types.ToInt(AgentId),
        //            Creation = DateTime.Now,
        //            Description = Description,
        //            Note = Note,
        //            MediaType = MediaType,
        //            PropertyId = Types.ToInt(PropertyId),
        //            Status = Types.ToInt(Status),
        //            //UnitNum = Types.ToInt(UnitNum)
        //        };
        //        v.AdsEnd = v.AdsDate.AddMonths(3);
        //        if (id == 0)
        //            res = v.DoInsert<AdsView>();
        //        else
        //        {
        //            AdsView cur = AdsView.View(id);
        //            res = cur.DoUpdate<AdsView>(v);
        //        }
        //        message = res == 0 ? "הפרסום לא עודכן" : "הפרסום עודכן בהצלחה";
        //    }
        //    catch (Exception ex)
        //    {
        //        message = ex.Message;
        //    }
        //    return RedirectToStatus(message);
        //}

        public ActionResult UpdateAds()
        {

            int res = 0;
            string action = "הגדרת פרסום";
            AdsView v = null;
            try
            {
                var AgentId = GetUser();

                v = EntityContext.Create<AdsView>(Request.Form);
                //v.AgentId = GetUser();
                //v.MailOnChanges = Types.ToBool(Request.Form["MailOnChanges"], false);

                EntityValidator validator = EntityValidator.ValidateEntity(v, "הגדרת פרסום", "he");
                if (!validator.IsValid)
                {
                    return Json(GetFormResult(-1, action, validator.Result, v.AdsId), JsonRequestBehavior.AllowGet);
                }

                //res = PlotsContext.DoSave(v);
                bool isNew = v.AdsId == 0;
                if (isNew)
                    v.AdsEnd = v.AdsDate.AddMonths(1);

                res = AdsView.DoSave(v);

                //string message = res == 0 ? "הפרסום לא עודכן" : "הפרסום עודכן בהצלחה";
                string message = "";
                if (res < 0 && isNew && v.AdsId > 0)
                    message = "הנכס המבוקש מפורסם, עליך להמתין עד " + v.AdsEnd.ToString("d");
                else if (v.AdsId <= 0)
                    message = "הפרסום לא עודכן";
                else
                    message = "הפרסום עודכן בהצלחה";

                //if (v.AdsId == 0)
                //    res = v.DoInsert<AdsView>();
                //else
                //{
                //    AdsView cur = AdsView.View(v.AdsId);
                //    res = cur.DoUpdate<AdsView>(v);
                //}
                //string message = res == 0 ? "הפרסום לא עודכן" : "הפרסום עודכן בהצלחה";

                //string key = CacheKeys.GetAdsView(AgentId,(int)AdsStateView.WaitAndActive);
                //CacheRemove(key, CacheGroup.Ads);
                CacheRemove(CacheGroup.Ads);

                var model = new ResultModel() { Status = res, Title = action, Message = message, Link = null, OutputId = v.AdsId };

                return Json(model, JsonRequestBehavior.AllowGet);

                //return Json(GetFormResult(res, action, message, v.AdsId), JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(GetFormResult(-1, action, ex.Message, v.AdsId), JsonRequestBehavior.AllowGet);
            }

        }
        

        #endregion

        #region Methods
        
        #endregion

        #region Transaction

        public ActionResult TransGrid()
        {
            return Authenticate(null);
        }

        [HttpPost]
        public JsonResult GetTransGrid()
        {
            int agentId = GetUser();
            string key= CacheKeys.GetTransList(agentId);
            IEnumerable<TransactionItem> list = (IEnumerable<TransactionItem>)CacheGet(key, CacheGroup.Transaction);

            if (list == null)
            {
                list = TransactionContext.ViewList(agentId);
                if (list != null)
                    CacheAdd(key, list, CacheGroup.Transaction);
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTransaction(int id, int trans_type, int parent_id, int contact_id)
        {
            //cid=contactId
            //pid=leadId
            //id=unitId or TransId
            //tt=transType

            int uid = GetUser();
            TransactionView trans = null;
            if (trans_type == 0 && id > 0)
                trans = TransactionContext.View(id);
            else if (trans_type == 1 && id > 0 && parent_id > 0 && contact_id > 0)
                trans = TransactionContext.FillBuyerTransaction(parent_id, id, contact_id, uid);
            else if (trans_type == 2 && id > 0 && contact_id > 0)
                trans = TransactionContext.FillSellerTransaction(parent_id, id, contact_id, uid);
            else if (trans_type == 3 && parent_id > 0 && contact_id > 0)
                trans = TransactionContext.FillAdviceTransaction(parent_id, id, contact_id, uid);
            else
                trans = new TransactionView() { AgentId = uid };//, UploadKey = Guid.NewGuid().ToString() };

            return Json(trans, JsonRequestBehavior.AllowGet);
        }
/*
        public JsonResult GetBuyerTransaction(int id, int tt, int pid, int cid)
        {
            //cid=contactId
            //pid=leadId
            //id=unitId
            //tt=transType

            int uid = GetUser();
            TransactionView trans = null;
            if (tt == 0 && id > 0)
                trans = TransactionContext.View(id);
            else if (tt == 1 && id > 0 && pid > 0 && cid > 0)
                trans = TransactionContext.FillBuyerTransaction(pid, id, cid, uid);
            else if (tt == 2 && id > 0 && pid > 0 && cid > 0)
                trans = TransactionContext.FillBuyerTransaction(pid, id, cid, uid);
            else
                trans = new TransactionView() { AgentId = uid };//, UploadKey = Guid.NewGuid().ToString() };

            return Json(trans, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAdviceTransaction(int id, int tt, int pid, int cid)
        {
            //cid=contactId
            //pid=leadId
            //id=unitId
            //tt=transType

            int uid = GetUser();
            TransactionView trans = null;
            if (tt == 0 && id > 0)
                trans = TransactionContext.View(id);
            else if (tt == 1 && id > 0 && pid > 0 && cid > 0)
                trans = TransactionContext.FillBuyerTransaction(pid, id, cid, uid);
            else if (tt == 2 && id > 0 && pid > 0 && cid > 0)
                trans = TransactionContext.FillBuyerTransaction(pid, id, cid, uid);
            else
                trans = new TransactionView() { AgentId = uid };//, UploadKey = Guid.NewGuid().ToString() };

            return Json(trans, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetSellerTransaction(int id, int tt, int pid, int cid)
        {
            //cid=contactId
            //pid=leadid/clientid
            //pname=client name
            //id=unitId
            //tt=transType

            int uid = GetUser();
            TransactionView trans = null;
            if (tt == 0 && id > 0)
                trans = TransactionContext.View(id);
            else if (tt == 1 && id > 0 && pid > 0 && cid > 0)
                trans = TransactionContext.FillSellerTransaction(pid, id, cid, uid);
            else if (tt == 2 && id > 0 && pid > 0 && cid > 0)
                trans = TransactionContext.FillSellerTransaction(pid,id, cid, uid);
            else
                trans = new TransactionView() { AgentId = uid };//, UploadKey = Guid.NewGuid().ToString() };

            return Json(trans, JsonRequestBehavior.AllowGet);
        }
*/
        public ActionResult TransactionBuyerDef()
        {
            return Authenticate(null);
        }
        public ActionResult TransactionSellerDef()
        {
            return Authenticate(null);
        }
        public ActionResult TransactionAdviceDef()
        {
            return Authenticate(null);
        }
        [HttpPost]
        // [ValidateAntiForgeryToken]
        public ActionResult UpdateTransaction()
        {

            int transId = 0;
            string action = "דוח עסקה";
            TransactionView l = null;
            try
            {


                int uid = GetUser();
                //string key = CacheKeys.GetAdminTransList(agentId);
                string key = CacheKeys.GetTransList(uid);
                CacheRemove(key, CacheGroup.Transaction);

                transId = Request.Form.Get<int>("TransId");
                l = EntityContext.Create<TransactionView>(Request.Form);
                l.TransId = transId;
                l.AgentId = uid;

                if (transId == 0)
                {
                    //l.LastUpdate = DateTime.Now;
                    //l.UploadKey = trans == 0 ? null : Request.Form.Get("UploadKey");
                    l.Creation = DateTime.Now;
                    //res = TransactionContext.DoSave(trans,l);
                }

                transId = TransactionContext.DoSave(l);

                return Json(GetFormResult(transId, action, null, l.TransId), JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(GetFormResult(-1, action, ex.Message, l.TransId), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        public ActionResult CancelTransaction(int transId)
        {
            string action = "ביטול דוח עסקה";
            //int res = 0;
            try
            {
                int uid = GetUser();

                TransactionContext.DoCancel(transId,uid);

                return Json(GetFormResult(1, action, null, transId), JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(GetFormResult(-1, action, ex.Message, transId), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        public JsonResult DeleteTransaction(int TransId)
        {

            int res = 0;
            string action = "מחיקת עסקה";
            ResultModel model = null;
            try
            {
                var userId = GetUser();
                //string key = CacheKeys.GetTransactionView(userId);
                //CacheRemove(key, CacheGroup.Crm);

                res = -3;// TransactionContext.DoDelete(TransId);
                if (res == -3)
                    model = new ResultModel() { Status = res, Title = action, Message = "אין הרשאה למחיקת עסקה", OutputId = TransId };
                else if (res == -1)
                    model = new ResultModel() { Status = res, Title = action, Message = "אירעה שגיאה דוח העסקה לא הוסר", OutputId = TransId };
                else
                    model = new ResultModel() { Status = res, Title = action, Message = "דוח העסקה הוסר", OutputId = TransId };
            }
            catch (Exception ex)
            {
                model = new ResultModel() { Status = -1, Title = action, Message = "אירעה שגיאה " + ex.Message, OutputId = TransId };
            }
            return Json(model, JsonRequestBehavior.AllowGet);
        }
       
        [HttpPost]
        public JsonResult GetTransactionPaymentList(int TransId)
        {

            //string key = CacheKeys.GetLeadPropertyList(TransId);

            IEnumerable<TransactionPayement> list = null;// (IEnumerable<TransactionPayement>)CacheGet(key, CacheGroup.Property);

            if (list == null)
            {
                list = TransactionContext.TransactionPayementsView(TransId);
                if (list != null)
                {
                    //CacheAdd(key, list, CacheGroup.Property);
                }
            }

            return Json(list, JsonRequestBehavior.AllowGet);
        }
        //[HttpPost]
        //public JsonResult TransactionPaymentListAdd(int TransId, string PropertyList)
        //{
        //    int res = 0;
        //    try
        //    {
        //        //string key = CacheKeys.GetLeadPropertyList(TransId);
        //        //CacheRemove(key, CacheGroup.Crm);
        //        res = TransactionContext.LeadsPropertyListAdd(TransId, PropertyList);
        //    }
        //    catch (Exception ex)
        //    {
        //        res = -1;
        //    }
        //    return Json(res, JsonRequestBehavior.AllowGet);
        //}

      
        #endregion

    }
}
