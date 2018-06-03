using Pro.Models;
using Pro.Data;
using Pro.Data.Entities;
using Natam.Mvc.Models;
using Nistec;
using Nistec.Data;
using Nistec.Data.Entities;
using Nistec.Web;
using Nistec.Web.Cms;
using Nistec.Web.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Pro.Lib;
using Nistec.Web.Controls;

namespace Natam.Mvc.Controllers
{
    [Authorize]
    public class AdminController : BaseController
    {
       
        #region admin

        public ActionResult Manager()
        {
            if (IsAdmin())
                return RedirectToAction("Main", "Admin");
            return View();
        }
        public ActionResult LogonGrid()
        {
            return AuthenticateAdmin(null);
        }
        public ActionResult SysProperties()
        {
            return AuthenticateAdmin(null);
        }

        //public ActionResult UserInfo(int userId)
        //{
        //    var view =userId==0 ? new UsersView():UsersView.GetUsersView(userId);
        //    return View(view);
        //}
        public ActionResult UserPerms()
        {
            return AuthenticateAdmin(null);
        }
        //public ActionResult UsersList()
        //{
        //    var view = UsersView.GetUsersView();
        //    return AuthenticateAdmin(view);
        //}
          #endregion

        #region trans grid
        public ActionResult TransGrid()
        {
            return Authenticate(null);
        }

        [HttpPost]
        public JsonResult GetTransGrid()
        {
            int agentId = GetUser();
            string key = CacheKeys.GetAdminTransList(agentId);
            IEnumerable<TransactionItem> list = (IEnumerable<TransactionItem>)CacheGet(key, CacheGroup.Transaction);

            if (list == null)
            {
                list = TransactionContext.ViewAdminList();
                if (list != null)
                    CacheAdd(key, list, CacheGroup.Transaction);
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        #endregion
 
        #region properties

        public ActionResult CategoryTypes()
        {
            return View();
        }
        public ActionResult DealDef()
        {
            //var list = DbNatam.Instance.GetEntityList<DealView>(DealView.MappingName, null);
            return View();
        }
        public ActionResult PurposeDef()
        {
            return View();
        }
        public ActionResult ZoneDef()
        {
            return View();
        }
        public ActionResult AreaDef()
        {
            //var list = DbNatam.Instance.GetEntityList<AreaView>(AreaView.MappingName, null);
            return View();
        }
        public ActionResult NewsDef()
        {
            return View();
        }
        public ActionResult UsersDef()
        {
            //var list = DbNatam.Instance.GetEntityList<AreaView>(AreaView.MappingName, null);
            return View();
        }
        [HttpPost]
        public JsonResult GetUsersRoles()
        {
            var list = DbNatam.Instance.EntityItemList<UserRoles>(UserRoles.MappingName, null);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetUsersProfile()
        {
            var list = DbNatam.Instance.EntityItemList<UserProfileView>(UserProfileView.MappingName, "IsBlocked", false);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetUsersBlocked()
        {
            var list = DbNatam.Instance.EntityItemList<UserProfileView>(UserProfileView.MappingName, "IsBlocked", true);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetUps(int ups)
        {
            var entity = DbNatam.Instance.EntityItemGet<UserMembership>(EntityMappingAttribute.Mapping<UserMembership>(), "UserId", ups);
            return Json(entity, JsonRequestBehavior.AllowGet);
        }

        public static UserResult GetResult(AuthState state)
        {
            string desc = "";
            switch (state)
            {
                case AuthState.Failed:// = -1,
                    desc = "אירעה שגיאה"; break;
                case AuthState.UnAuthorized:// = 0, //--0=auth faild
                    desc = "פרטי ההזדהות אינם מוכרים במערכת"; break;
                case AuthState.IpNotAlowed:// = 1,//--1=ip not alowed
                    desc = "כתובת השרת אינה מוכרת במערכת"; break;
                case AuthState.EvaluationExpired:// = 2,//--2=Evaluation expired
                    desc = "תוקף תקופת הנסיון הסתיים"; break;
                case AuthState.Blocked:// = 3,//--3=account blocked
                    desc = "משתמש חסום במערכת"; break;
                case AuthState.NonConfirmed:// = 4,//--4=non confirmed, username or password exists
                    desc = "שם משתמש ו או סיסמה קיימים במערכת"; break;
                case AuthState.UserRemoved:// = 5,//user removed
                    desc = "המשתמש הוסר מהמערכת"; break;
                case AuthState.UserNotRemoved:// = 6,//user not removed
                    desc = "המשתמש לא הוסר מהמערכת"; break;
                case AuthState.UserUpdated:// = 7,//user updated
                    desc = "פרטי המשתמש עודכנו במערכת"; break;
                case AuthState.UserNotUpdated:// = 7,//user updated
                    desc = "פרטי המשתמש לא עודכנו במערכת"; break;
                case AuthState.Succeeded:// = 10//--10=ok
                    desc = "Ok"; break;
            }
            return new UserResult() { Status = (int)state, Description = desc };
        }
        public void SetResult(UserResult ur)
        {
            switch ((AuthState)ur.Status)
            {
                case AuthState.Failed:// = -1,
                    ur.Description = "אירעה שגיאה"; break;
                case AuthState.UnAuthorized:// = 0, //--0=auth faild
                    ur.Description = "פרטי ההזדהות אינם מוכרים במערכת"; break;
                case AuthState.IpNotAlowed:// = 1,//--1=ip not alowed
                    ur.Description = "כתובת השרת אינה מוכרת במערכת"; break;
                case AuthState.EvaluationExpired:// = 2,//--2=Evaluation expired
                    ur.Description = "תוקף תקופת הנסיון הסתיים"; break;
                case AuthState.Blocked:// = 3,//--3=account blocked
                    ur.Description = "משתמש חסום במערכת"; break;
                case AuthState.NonConfirmed:// = 4,//--4=non confirmed, username or password exists
                    ur.Description = "שם משתמש ו או סיסמה קיימים במערכת"; break;
                case AuthState.UserRemoved:// = 5,//user removed
                    ur.Description = "המשתמש הוסר מהמערכת"; break;
                case AuthState.UserNotRemoved:// = 6,//user not removed
                    ur.Description = "המשתמש לא הוסר מהמערכת"; break;
                case AuthState.UserUpdated:// = 7,//user updated
                    ur.Description = "פרטי המשתמש עודכנו במערכת"; break;
                case AuthState.UserNotUpdated:// = 7,//user updated
                    ur.Description = "פרטי המשתמש לא עודכנו במערכת"; break;
                case AuthState.Succeeded:// = 10//--10=ok
                    ur.Description = "Ok"; break;
            }
        }
                

        // Insert=0,Update=1,Delete=2,StoredProcedure=3
        [HttpPost]
        public JsonResult UserDefUpdate(int UserId, string UserName, int UserRole, string Email, string Phone, int AccountId, string Lang, int Evaluation, bool IsBlocked, string DisplayName)//UserProfile user, int command)
        {
            UserProfile newItem = new UserProfile()
            {
                AccountId = AccountId,
                Creation = DateTime.Now,
                DisplayName = DisplayName,
                Email = Email,
                Evaluation = Evaluation,
                IsBlocked = IsBlocked,
                Lang = Lang,
                Phone = Phone,
                UserId = UserId,
                UserName = UserName,
                UserRole = UserRole
            };
            UserProfile view = UserProfile.Get(UserId);
            var result = view.Update(newItem);
            SetResult(result);
            return Json(result);
        }

        // Insert=0,Update=1,Delete=2,StoredProcedure=3
        [HttpPost]
        public JsonResult UserDefDelete(int UserId)
        {
            UserProfile view = UserProfile.Get(UserId);
            var result = view.Delete("websp_UserDelete");
            SetResult(result);
            return Json(result);
        }

        // Insert=0,Update=1,Delete=2,StoredProcedure=3
        [HttpPost]
        public JsonResult UserDefRegister(string UserName, int UserRole, string Email, string Phone, int AccountId, string Lang, int Evaluation, bool IsBlocked, string DisplayName, string Password)//(UserRegister user)
        {
            var user = new UserRegister(UserName, UserRole, Email, Phone, AccountId, Lang, Evaluation, IsBlocked, DisplayName, Password);
            
            UserResult result = Authorizer.Register(user);
            SetResult(result);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        
        // Insert=0,Update=1,Delete=2,StoredProcedure=3
        [HttpPost]
        public JsonResult UserUpsUpdate(int UserId, string Ups, int command)
        {
            UserResult result = null;
            UserMembership newItem = new UserMembership(UserId, Ups, Ups);
            //{
            //    Password = Ups,
            //    UserId = UserId,
            //    CreateDate = DateTime.Now
            //};
            switch (command)
            {
                case 0://insert
                    result = newItem.Insert(); break;
                case 2://delete
                    result = newItem.Delete(); break;
                default:
                    UserMembership view = UserMembership.Get(UserId);
                    result = view.Update(newItem);
                    break;
            }
            if (result == null)
                result = UserResult.Get(AuthState.Failed);
            SetResult(result);
            //UserMembership view = command == 0 ? new UserMembership() : UserMembership.Get(UserId);
            //int result = view.Update(newItem, (Nistec.Data.UpdateCommandType)command);
            //return Json(result.ToString());
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        // Insert=0,Update=1,Delete=2,StoredProcedure=3
        [HttpPost]
        public JsonResult DealDefUpdate(int DealId, string DealName, int command)
        {
            string key = "GetDealView";
            int result = 0;
            try
            {
                CacheRemove(key, CacheGroup.Props);
                DealView newItem = new DealView() { DealId = DealId, DealName = DealName };

                result = DealContext.DoSave(DealId, newItem, (UpdateCommandType)command);

                //switch (command)
                //{
                //    case 0://insert
                //        result = newItem.Insert<DealView>(); break;
                //    case 2://delete
                //        result = newItem.Delete<DealView>(); break;
                //    default:
                //        DealView view = DealView.View(DealId);
                //        result = view.Update(newItem);
                //        break;
                //}
            }
            catch (Exception ex)
            {
                string err = ex.Message;
                result = -1;
            }
            return Json(result.ToString());
        }

        // Insert=0,Update=1,Delete=2,StoredProcedure=3
        [HttpPost]
        public JsonResult PurposeDefUpdate(int PurposeId, string PurposeName, int command)
        {
            string key = "GetPurposeView";
            int result = 0;
            try
            {
                CacheRemove(key, CacheGroup.Props);
                if (command == 2)//delete
                    result = EntityProp.PropertyRemove("purpose", PurposeId, 0);
                else
                {
                    PurposeView newItem = new PurposeView() { PurposeId = PurposeId, PurposeName = PurposeName };
                    result = PurposeContext.DoSave(PurposeId, newItem, (UpdateCommandType)command);
                }

            //switch (command)
            //{
            //    case 0://insert
            //        result = newItem.Insert<PurposeView>(); break;
            //    case 2://delete
            //        result = EntityProp.PropertyRemove("purpose", id, 0);
            //        //result = newItem.Delete<PurposeView>(); 
            //        break;
            //    default:
            //        PurposeView view = PurposeView.View(PurposeId);
            //        result = view.Update(newItem);
            //        break;
            //}

            }
            catch (Exception ex)
            {
                string err = ex.Message;
                result = -1;
            }
            return Json(result.ToString());
        }
        // Insert=0,Update=1,Delete=2,StoredProcedure=3
        [HttpPost]
        public JsonResult AreaDefUpdate(int AreaId, string AreaName, int ZoneId, int command)
        {
            string key = "GetAreaViewAll";
            CacheRemove(key, CacheGroup.Props);

            int result = 0;
            AreaView newItem = new AreaView() { AreaId = AreaId, AreaName = AreaName, ZoneId = ZoneId };
            switch (command)
            {
                case 0://insert
                    result = newItem.DoInsert<AreaView>(); break;
                case 2://delete
                    result = EntityProp.PropertyRemove("area", AreaId, 0);
                    //result = newItem.DoDelete<AreaView>(); 
                    break;
                default:
                    AreaView view = AreaView.View(AreaId);
                    result = view.DoUpdate(newItem);
                    break;
            }
            return Json(result.ToString());
        }
        // Insert=0,Update=1,Delete=2,StoredProcedure=3
        [HttpPost]
        public JsonResult ZoneDefUpdate(int ZoneId, string ZoneName, int command)
        {
            string key = "GetZoneView";
            CacheRemove(key, CacheGroup.Props);
            int result = 0;
            ZoneView newItem = new ZoneView() { ZoneId = ZoneId, ZoneName = ZoneName };
            switch (command)
            {
                case 0://insert
                    result = newItem.DoInsert<ZoneView>(); break;
                case 2://delete
                    result = EntityProp.PropertyRemove("zone", ZoneId, 0);
                    //result = newItem.DoDelete<ZoneView>(); 
                    break;
                default:
                    ZoneView view = ZoneView.View(ZoneId);
                    result = view.DoUpdate(newItem);
                    break;
            }
            return Json(result.ToString());
        }

        [HttpPost]
        public JsonResult NewsDefUpdate(int NewsId, string NewsName, int command)
        {
            string key = "GetNewsView";
            int result = 0;
            try
            {
                CacheRemove(key, CacheGroup.Props);
                if (command == 2)//delete
                {
                    result = NewsView.DoDelete(NewsId);
                }
                else
                {
                    NewsView newItem = new NewsView() { NewsId = NewsId, NewsName = NewsName };
                    result = NewsView.DoSave(NewsId, newItem);
                }
            }
            catch (Exception ex)
            {
                string err = ex.Message;
                result = -1;
            }
            return Json(result.ToString());
        }
        #endregion

        #region AdTeam

        [HttpGet]
        public ActionResult AdTeamDef()
        {
            return View(true);
        }

        [HttpPost]
        public ActionResult AdTeamDefList()
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdTeamItem>(accountId);
            var list = db.GetList(accountId);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AdTeamShowMembers(int id)
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdTeamItem>(accountId);
            var list = db.GetList(accountId);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AdTeamDefUpdate()
        {
            string action = "עדכון צוותים";
            AdContext<AdTeamItem> context = null;
            try
            {
                ValidateUpdate(GetUser(), "AdTeamDefUpdate");

                int accountId = GetAccountId();
                context = new AdContext<AdTeamItem>(accountId);
                context.Set(Request.Form);
                context.Current.AccountId = accountId;
                var res = context.SaveChanges();
                return Json(context.GetFormResult(res, null), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(FormResult.GetTrace<DbNatam>(ex, action, Request), JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public ActionResult AdTeamDefDelete(int TeamId)
        {
            string action = "מחיקת צוות";
            AdContext<AdTeamItem> context = null;
            try
            {
                ValidateDelete(GetUser(), "AdTeamDefDelete");

                int accountId = GetAccountId();
                context = new AdContext<AdTeamItem>(accountId);
                var res = context.Delete("TeamId", TeamId, "AccountId", accountId);
                return Json(FormResult.Get(res, context.EntityName, "ok"), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(FormResult.GetTrace<DbNatam>(ex, action, Request), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AdTeamDefRel(int id)
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdTeamItemRel>(accountId);
            var list = db.ExecOrViewList("AccountId", accountId, "TeamId", id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult AdTeamDefRelAll(int id)
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdTeamItemRelAll>(accountId);
            var list = db.ExecOrViewList("TeamId", id, "AccountId", accountId, "IsAll", 2);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult AdTeamDefRelToAdd(int id)
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdTeamItemRelAll>(accountId);
            var list = db.ExecOrViewList("TeamId", id, "AccountId", accountId, "IsAll", 1);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AdTeamDefRelUpdate()
        {
            string action = "הגדרת צוותים";
            AdContext<AdTeamItemRel> context = null;
            try
            {
                ValidateUpdate(GetUser(), "AdTeamDefRelUpdate");

                int accountId = GetAccountId();
                int groupid = Types.ToInt(Request["TeamId"]);
                string users = Request["Users"];
                if (groupid > 0 && !string.IsNullOrEmpty(users))
                {
                    context = new AdContext<AdTeamItemRel>(accountId);
                    //@Mode tinyint=0--0= insert,1=upsert,2=delete
                    var model = context.Upsert(UpsertType.Update, ReturnValueType.ReturnValue, "TeamId", groupid, "AccountId", accountId, "Users", users, "Mode", 0);//Update
                    return Json(context.GetFormResult(model, null), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(FormResult.Get(0, action, null), JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(FormResult.GetTrace<DbNatam>(ex, action, Request), JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public ActionResult AdTeamDefRelDelete()
        {
            string action = "מחיקת משתמשים מצוות";
            AdContext<AdTeamItemRel> context = null;
            int res = 0;
            try
            {
                ValidateDelete(GetUser(), "AdTeamDefRelDelete");
                int groupid = Types.ToInt(Request["TeamId"]);
                int userid = Types.ToInt(Request["UserId"]);
                if (groupid > 0 && userid > 0)
                {
                    int accountId = GetAccountId();
                    context = new AdContext<AdTeamItemRel>(accountId);
                    res = context.Delete("TeamId", groupid, "AccountId", accountId, "UserId", userid);
                }
                return Json(FormResult.Get(res, context.EntityName, "ok"), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(FormResult.GetTrace<DbNatam>(ex, action, Request), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AdTeamDefLeadUpdate()
        {
            string action = "הגדרת ראש צוות";
            try
            {
                var su = GetSignedUser(true);
                var userId = su.UserId;
                int accountId = su.AccountId;
                ValidateUpdate(su, "AdTeamDefRelUpdate");
                
                int TeamId = Types.ToInt(Request["TeamId"]);
                int TeamLead = Types.ToInt(Request["TeamLead"]);

                //string users = Request["Users"];
                if (TeamId > 0 && TeamLead > 0)
                {
                    var res=AdContext.UpdateTeamLeader(accountId, TeamId, TeamLead);
                    return Json(FormResult.Get(res, action, null), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(FormResult.Get(0, action, null), JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(FormResult.GetTrace<DbNatam>(ex, action, Request), JsonRequestBehavior.AllowGet);
            }
        }

        

        #endregion

        #region AdGroup

        [HttpGet]
        public ActionResult AdGroupDef()
        {
            return View(true);
        }

        [HttpPost]
        public ActionResult AdGroupDefList()
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdGroupItem>(accountId);
            return Json(db.GetList(accountId), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AdGroupShowMembers()
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdGroupItem>(accountId);
            return Json(db.GetList(accountId), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AdGroupDefUpdate()
        {
            string action = "עדכון קבוצה";
            AdContext<AdGroupItem> context = null;
            try
            {
                ValidateUpdate(GetUser(), "AdGroupDefUpdate");

                int accountId = GetAccountId();
                context = new AdContext<AdGroupItem>(accountId);
                context.Set(Request.Form);
                context.Current.AccountId = accountId;
                var res = context.SaveChanges();
                return Json(context.GetFormResult(res, null), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(FormResult.GetTrace<DbNatam>(ex, action, Request), JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public ActionResult AdGroupDefDelete(int GroupId)
        {
            string action = "מחיקת קבוצה";
            AdContext<AdGroupItem> context = null;
            try
            {
                ValidateDelete(GetUser(), "AdGroupDefDelete");

                int accountId = GetAccountId();
                context = new AdContext<AdGroupItem>(accountId);
                var res = context.Delete("GroupId", GroupId, "AccountId", accountId);
                return Json(FormResult.Get(res, context.EntityName, "ok"), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(FormResult.GetTrace<DbNatam>(ex, action, Request), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AdGroupDefRel(int id)
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdGroupItemRel>(accountId);
            return Json(db.ExecOrViewList("AccountId", accountId, "GroupId", id), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult AdGroupDefRelAll(int id)
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdGroupItemRelAll>(accountId);
            return Json(db.ExecOrViewList("GroupId", id, "AccountId", accountId, "IsAll", 2), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult AdGroupDefRelToAdd(int id)
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdGroupItemRelAll>(accountId);
            return Json(db.ExecOrViewList("GroupId", id, "AccountId", accountId, "IsAll", 1), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AdGroupDefRelUpdate()
        {
            AdContext<AdGroupItemRel> context = null;
            string action = "הגדרת קבוצות";
            try
            {
                ValidateUpdate(GetUser(), "AdGroupDefRelUpdate");

                int accountId = GetAccountId();
                int groupid = Types.ToInt(Request["GroupId"]);
                string users = Request["Users"];
                if (groupid > 0 && !string.IsNullOrEmpty(users))
                {
                    context = new AdContext<AdGroupItemRel>(accountId);
                    //@Mode tinyint=0--0= insert,1=upsert,2=delete
                    var model = context.Upsert(UpsertType.Update, ReturnValueType.ReturnValue, "GroupId", groupid, "AccountId", accountId, "Users", users, "Mode", 0);//.Update
                    return Json(context.GetFormResult(model, null), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(FormResult.Get(0, action, null, 0), JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(FormResult.GetTrace<DbNatam>(ex, action, Request), JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public ActionResult AdGroupDefRelDelete()
        {
            string action = "הסרת משתמש מקבוצה";
            AdContext<AdGroupItemRel> context = null;
            int res = 0;
            try
            {
                ValidateDelete(GetUser(), "AdGroupDefRelDelete");
                int groupid = Types.ToInt(Request["GroupId"]);
                int userid = Types.ToInt(Request["UserId"]);
                if (groupid > 0 && userid > 0)
                {
                    int accountId = GetAccountId();
                    context = new AdContext<AdGroupItemRel>(accountId);
                    res = context.Delete("GroupId", groupid, "AccountId", accountId, "UserId", userid);
                }
                return Json(FormResult.Get(res, context.EntityName, "ok"), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(FormResult.GetError(action, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

        #endregion

        #region AdDepartment

        [HttpGet]
        public ActionResult AdDepartmentDef()
        {
            return View(true);
        }

        [HttpPost]
        public ActionResult AdDepartmentDefList()
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdDepartmentItem>(accountId);
            return Json(db.GetList(accountId), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AdDepartmentShowMembers()
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdDepartmentItem>(accountId);
            return Json(db.GetList(accountId), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AdDepartmentDefUpdate()
        {
            string action = "עדכון מחלקה";
            AdContext<AdDepartmentItem> context = null;
            try
            {
                ValidateUpdate(GetUser(), "AdDepartmentDefUpdate");

                int accountId = GetAccountId();
                context = new AdContext<AdDepartmentItem>(accountId);
                context.Set(Request.Form);
                context.Current.AccountId = accountId;
                var res = context.SaveChanges();
                return Json(context.GetFormResult(res, null), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(FormResult.GetTrace<DbNatam>(ex, action, Request), JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public ActionResult AdDepartmentDefDelete(int DepartmentId)
        {
            string action = "מחיקת מחלקה";
            AdContext<AdDepartmentItem> context = null;
            try
            {
                ValidateDelete(GetUser(), "AdDepartmentDefDelete");

                int accountId = GetAccountId();
                context = new AdContext<AdDepartmentItem>(accountId);
                var res = context.Delete("DepartmentId", DepartmentId, "AccountId", accountId);
                return Json(FormResult.Get(res, context.EntityName, "ok"), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(FormResult.GetTrace<DbNatam>(ex, action, Request), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AdDepartmentDefRel(int id)
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdDepartmentItemRel>(accountId);
            var list = db.ExecOrViewList("AccountId", accountId, "DepartmentId", id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult AdDepartmentDefRelAll(int id)
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdDepartmentItemRelAll>(accountId);
            var list = db.ExecOrViewList("DepartmentId", id, "AccountId", accountId, "IsAll", 2);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult AdDepartmentDefRelToAdd(int id)
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdDepartmentItemRelAll>(accountId);
            var list = db.ExecOrViewList("DepartmentId", id, "AccountId", accountId, "IsAll", 1);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AdDepartmentDefRelUpdate()
        {
            AdContext<AdDepartmentItemRel> context = null;
            string action = "הגדרת מחלקות";
            try
            {
                ValidateUpdate(GetUser(), "AdDepartmentDefRelUpdate");

                int accountId = GetAccountId();
                int Departmentid = Types.ToInt(Request["DepartmentId"]);
                string users = Request["Users"];
                if (Departmentid > 0 && !string.IsNullOrEmpty(users))
                {
                    context = new AdContext<AdDepartmentItemRel>(accountId);
                    //@Mode tinyint=0--0= insert,1=upsert,2=delete
                    var model = context.Upsert(UpsertType.Update, ReturnValueType.ReturnValue, "DepartmentId", Departmentid, "AccountId", accountId, "Users", users, "Mode", 0);//.Update
                    return Json(context.GetFormResult(model, null), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(FormResult.Get(0, action, null, 0), JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(FormResult.GetTrace<DbNatam>(ex, action, Request), JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public ActionResult AdDepartmentDefRelDelete()
        {
            string action = "הסרת משתמש ממחלקה";
            AdContext<AdDepartmentItemRel> context = null;
            int res = 0;
            try
            {
                ValidateDelete(GetUser(), "AdDepartmentDefRelDelete");
                int Departmentid = Types.ToInt(Request["DepartmentId"]);
                int userid = Types.ToInt(Request["UserId"]);
                if (Departmentid > 0 && userid > 0)
                {
                    int accountId = GetAccountId();
                    context = new AdContext<AdDepartmentItemRel>(accountId);
                    res = context.Delete("DepartmentId", Departmentid, "AccountId", accountId, "UserId", userid);
                }
                return Json(FormResult.Get(res, context.EntityName, "ok"), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(FormResult.GetError(action, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

         [HttpPost]
        public ActionResult AdDepartmentUsersRel(int id)
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdDepartmentUsersRel>(accountId);
            var list = db.ExecOrViewList("DepartmentId", id, "AccountId", accountId, "IsAll", 4);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult AdDepartmentUsersToLeadRel(int id)
        {
            int accountId = GetAccountId();
            var db = new AdContext<AdDepartmentUsersRel>(accountId);
            var list = db.ExecOrViewList("DepartmentId", id, "AccountId", accountId, "IsAll", 3);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AdDepartmentLeadUpdate()
        {
            string action = "הגדרת מנהל מחלקה";
            try
            {
                var su = GetSignedUser(true);
                var userId = su.UserId;
                int accountId = su.AccountId;
                ValidateUpdate(su, "AdDepartmentLeadUpdate");

                int DepartmentId = Types.ToInt(Request["DepartmentId"]);
                int Manager = Types.ToInt(Request["Manager"]);

                //string users = Request["Users"];
                if (DepartmentId > 0 && Manager > 0)
                {
                    var res = AdContext.UpdateDepartmentLeader(accountId, DepartmentId, Manager);
                    return Json(FormResult.Get(res, action, null), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(FormResult.Get(0, action, null), JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(FormResult.GetTrace<DbNatam>(ex, action, Request), JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginModel model, string returnUrl)
        {

            var user = FormsAuth.DoSignInUser(model.UserName, model.Password, model.RememberMe, true);
            if (user != null || user.IsAdmin)
            {
                return RedirectToLocal(returnUrl);
            }
            // If we got this far, something failed, redisplay form
            //ModelState.AddModelError("", "The user name or password provided is incorrect.");
            return RedirectToIndex("The user name or password provided is incorrect.");// View(model);

            //return Index("The user name or password provided is incorrect.");
        }

        protected override ActionResult RedirectToIndex(string message)
        {

            ViewBag.Message = message;

            ModelState.AddModelError("ErrorMessage", "The user name or password provided is incorrect.");

            return RedirectToAction("Manager", "Admin", ModelState);//new { ErrorMessage = message });

        }

        protected override ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Main", "Admin");
            }
        }

        public ActionResult Main()
        {
            return Authenticate(null);
        }

      
    }
}
