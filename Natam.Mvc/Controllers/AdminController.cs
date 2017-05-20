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

        //[HttpPost]
        //[AllowAnonymous]
        //[ValidateAntiForgeryToken]
        //public JsonResult CreatePassword(int UserId, bool sendMail)
        //{
        //    var user = UserProfile.Get(UserId);
        //    if (user == null)
        //    {
        //        TempData["Message"] = "User Not exist.";
        //    }
        //    else
        //    {
        //        string UserName = user.UserName;
        //        //generate password token
        //        var token = WebSecurity.GeneratePasswordResetToken(UserName);

        //        //create url with above token

        //        //var resetLink = "<a href='" + Url.Action("ResetPassword", "Home", new { un = UserName, rt = token }, "http") + "'>Reset Password</a>";
        //        //var resetLink = Url.Action("ResetPassword", "Home", new { un = UserName, rt = token }, "http");

        //        string result = "";
        //        try
        //        {
        //            result = UserMembership.CreatePassword(user, sendMail, token);
        //        }
        //        catch (Exception ex)
        //        {
        //            result = ex.Message;
        //        }

        //        TempData["Message"] = result;

        //    }
        //}


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
