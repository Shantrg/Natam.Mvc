using Pro.Models;
using Pro.Data;
using Pro.Data.Entities;
using Natam.Mvc.Models;
using Nistec;
using Nistec.Data;
using Nistec.Data.Entities;
using Nistec.Generic;
using Nistec.Web.Security;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Web.Mvc;
using Newtonsoft.Json;
using Pro.Data.Entities;
using Nistec.Web.Controls;

namespace Natam.Mvc.Controllers
{
    [Authorize]
    public class BuildingController : BaseController
    { 
        #region demo
        //private readonly List<Client> clients = new List<Client>()
        //{
        //    new Client { Id = 1, Name = "Julio Avellaneda", Email = "julito_gtu@hotmail.com" },
        //    new Client { Id = 2, Name = "Juan Torres", Email = "jtorres@hotmail.com" },
        //    new Client { Id = 3, Name = "Oscar Camacho", Email = "oscar@hotmail.com" },
        //    new Client { Id = 4, Name = "Gina Urrego", Email = "ginna@hotmail.com" },
        //    new Client { Id = 5, Name = "Nathalia Ramirez", Email = "natha@hotmail.com" },
        //    new Client { Id = 6, Name = "Raul Rodriguez", Email = "rodriguez.raul@hotmail.com" },
        //    new Client { Id = 7, Name = "Johana Espitia", Email = "johana_espitia@hotmail.com" }
        //};

        //public ActionResult DemoGrid()
        //{
        //    return View(clients);
        //}
        #endregion

        #region pages

        //public ActionResult BuildingGrid()
        //{
        //    var list=DbNatam.Instance.GetBuildingView();
        //    return Authenticate(list);

        //}
       
        //public ActionResult BuildingDef()
        //{
        //    return Authenticate(null);
        //}
        
        public ActionResult PropertyDef(int id=0)
        {
            return Authenticate(id);
        }
        public ActionResult BuildingFloor()
        {
            return Authenticate(null);
        }
        public ActionResult BuildingWizard()
        {
            return Authenticate(null);
        }
        public ActionResult Grid()
        {
            return Authenticate(null);
        }
        public ActionResult Investment()
        {
            return Authenticate(null);
        }
        public ActionResult Reminder()
        {
            return Authenticate(null);
        }
        
        #endregion

        #region Methods

        [HttpPost]
        public JsonResult GetDealView()
        {
            string key = CacheKeys.GetDealView;
            IEnumerable<DealView> list = (IEnumerable<DealView>)CacheGet(key, CacheGroup.Props);

            if (list == null)
            {
                list = DealContext.View();
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Props);
                }
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDealUnitView()
        {
            string key = CacheKeys.GetDealView;
            IEnumerable<DealView> list = (IEnumerable<DealView>)CacheGet(key, CacheGroup.Props);

            if (list == null)
            {
                list = DealContext.View();
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Props);
                }
            }
            return Json(list.Where(p => p.DealId < 5), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetPurposeView()
        {
            string key = CacheKeys.GetPurposeView;
            IEnumerable<PurposeView> list = (IEnumerable<PurposeView>)CacheGet(key, CacheGroup.Props);

            if (list == null)
            {
                list = PurposeView.View();
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Props);
                }
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetZoneView()
        {
            string key = CacheKeys.GetZoneView;
            IEnumerable<ZoneView> list = (IEnumerable<ZoneView>)CacheGet(key, CacheGroup.Props);

            if (list == null)
            {
                list = Lists.GetList<ZoneView>(ListsTypes.ZoneQueryTypes);// ZoneView.View();
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Props);
                }
            }
            
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetAreaView(int zone)
        {
            var list = AreaView.Filter(zone);
            return Json(list.OrderBy(v => v.AreaName).ToList(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetAreaViewAll()
        {
            string key = CacheKeys.GetAreaViewAll;
            IEnumerable<AreaZoneView> list = (IEnumerable<AreaZoneView>)CacheGet(key, CacheGroup.Props);

            if (list == null)
            {
                list = AreaZoneView.ViewAreaZone();
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Props, CacheTime.Hour);
                }
            }
            return Json(list.OrderBy(v => v.AreaName).ToList(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetCityListByArea(int area)
        {
            string key = CacheKeys.GetCityListView;
            IEnumerable<CityView> list = (IEnumerable<CityView>)CacheGet(key, CacheGroup.Props);

            if (list == null)
            {
                list = CityView.View();
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Props, CacheTime.Infinity);
                }
            }
            if (area > 0)
                return Json(list.Where(c => c.AreaCode == area).OrderBy(v => v.CityName).ToList(), JsonRequestBehavior.AllowGet);
            return Json(list.OrderBy(v => v.CityName).ToList(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetCityListView()
        {
            string key = CacheKeys.GetCityListView;
            IEnumerable<CityView> list = (IEnumerable<CityView>)CacheGet(key, CacheGroup.Props);

            if (list == null)
            {
                list = CityView.View();
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Props, CacheTime.Infinity);
                }
            }
            return Json(list.OrderBy(v => v.CityName).ToList(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetStreetsListByCity(int city)
        {
            var list = StreetView.Filter(city);
            return Json(list.OrderBy(v => v.StreetName).ToList(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetOwnerView()
        {
            string key = CacheKeys.GetOwnerView;
            IEnumerable<AccountListView> list = (IEnumerable<AccountListView>)CacheGet(key, CacheGroup.Accounts);

            if (list == null)
            {
                list = AccountListView.ViewOwners(); 
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Accounts);
                }
            }
            return Json(list.OrderBy(v => v.AccountName).ToList(), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetTenantView()
        {
            string key = CacheKeys.GetTenantView;
            IEnumerable<AccountListView> list = (IEnumerable<AccountListView>)CacheGet(key, CacheGroup.Accounts);

            if (list == null)
            {
                list = AccountListView.ViewTenants();
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Accounts);
                }
            }
            return Json(list.OrderBy(v => v.AccountName).ToList(), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetManagementView()
        {
            string key = CacheKeys.GetManagementView;
            IEnumerable<AccountListView> list = (IEnumerable<AccountListView>)CacheGet(key, CacheGroup.Accounts);

            if (list == null)
            {
                list = AccountListView.ViewManagements();
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Accounts);
                }
            }
            return Json(list.OrderBy(v => v.AccountName).ToList(), JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public JsonResult GetAirConditionView()
        {
            string key = CacheKeys.GetAirConditionView;
            IEnumerable<AirConditionView> list = (IEnumerable<AirConditionView>)CacheGet(key, CacheGroup.Props);

            if (list == null)
            {
                list = AirConditionView.View();
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Props);
                }
            }
            
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetParkingTypeView()
        {
            string key = CacheKeys.GetParkingTypeView;
            IEnumerable<ParkView> list = (IEnumerable<ParkView>)CacheGet(key, CacheGroup.Props);

            if (list == null)
            {
                list = ParkView.View();
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Props);
                }
            }

            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetContactView(int accountId)
        {
            string key = CacheKeys.GetContactView(accountId);
            IEnumerable<ContactListView> list = (IEnumerable<ContactListView>)CacheGet(key, CacheGroup.Accounts);

            if (list == null)
            {
                list = ContactListView.ListByAccount(accountId,0);
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Accounts);
                }
            }
            return Json(list.OrderBy(v => v.ContactName).ToList(), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetContactByRole(int role)
        {
            string key = CacheKeys.GetContactByRole(role);
            IEnumerable<ContactListView> list = (IEnumerable<ContactListView>)CacheGet(key, CacheGroup.Accounts);

            if (list == null)
            {
                list = ContactListView.ListByRole(role);
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Accounts);
                }
            }
            return Json(list.OrderBy(v => v.ContactName).ToList(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetBuildingClasses()
        {
            string key = CacheKeys.GetBuildingClass;
            IEnumerable<BuildingClasses> list = (IEnumerable<BuildingClasses>)CacheGet(key, CacheGroup.Props);

            if (list == null)
            {
                list = Lists.GetList<BuildingClasses>(ListsTypes.BuildingClass);
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Props);
                }
            }

            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDesignationView()
        {
            string key = CacheKeys.GetDesignation;
            IEnumerable<Designation> list = (IEnumerable<Designation>)CacheGet(key, CacheGroup.Props);

            if (list == null)
            {
                list = Lists.GetList<Designation>(ListsTypes.Designation);
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Props);
                }
            }

            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetOwnerTypeView()
        {
            string key = CacheKeys.GetOwnerType;
            IEnumerable<OwnerType> list = (IEnumerable<OwnerType>)CacheGet(key, CacheGroup.Props);

            if (list == null)
            {
                list = Lists.GetList<OwnerType>(ListsTypes.OwnerType);
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Props);
                }
            }

            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetAdsTypeView()
        {
            string key = CacheKeys.GetAdsType;
            IEnumerable<AdsType> list = (IEnumerable<AdsType>)CacheGet(key, CacheGroup.Props);

            if (list == null)
            {
                list = Lists.GetList<AdsType>(ListsTypes.AdsType);
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Props);
                }
            }

            return Json(list, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region methods

        //public JsonResult GetProperty(int id)
        //{
        //    var result = PropertyView.View(id);
        //    return Json(result, JsonRequestBehavior.AllowGet);
        //}
 
        public ActionResult SetBuildingFailed()
        {
            return View();
        }

        //protected override void Dispose(bool disposing)
        //{
        //    if (disposing)
        //    {
        //        db.Dispose();
        //    }
        //    base.Dispose(disposing);
        //}

        
        static bool ParseList(string value, ref int minValue, ref int maxValue)
        {
            //<option value="1">1-200</option>
            //<option value="2">200-500</option>
            //<option value="3">500-1000</option>
            //<option value="4">1000-2000</option>
            //<option value="5">2000 ויותר</option>
            int[] arraymin = new int[] {1,200,500,1000,2000 };
            int[] arraymax = new int[] {200,500,1000,2000,999999999 };

            if (string.IsNullOrEmpty(value))
            {
                minValue = 0;
                maxValue = 0;
                return false;
            }
            string[] args = value.Split(',');
            if (args == null || args.Length < 1)
            {
                minValue = 0;
                maxValue = 0;
                return false;
            }
            if (args.Length == 1)
            {
                minValue = 0;
                maxValue = 999999999;
                return true;
            }
            else //if (args.Length > 1)
            {
                minValue = arraymin[Types.ToInt(args[0])];
                maxValue = arraymax[Types.ToInt(args[1])];
                return true;
            }
        }
        #endregion

        #region Building

        public ActionResult BuildingNew()
        {
            return Authenticate(null);
        }

        [HttpGet]
        public ActionResult BuildingDef(int id = 0)
        {
            //var result = BuildingView.View(id);
            return Authenticate(id);
        }

        public ActionResult BuildingQuery()
        {
            return Authenticate(null);
        }
        //[HttpPost]
        public ActionResult BuildingGrid()
        {
            BuildingQuery query = new BuildingQuery(Request);
            //if (query.IsValid == false)
            //    return View();
            return View(query);
        }

        public JsonResult GetBuilding(int id)
        {
            if (id <= 0)
                return null;
            var result = BuildingContext.View(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ContentResult GetBuilderInfo(int id)
        {
            if (id <= 0)
                return null;
            var result = BuildingContext.GetBuilderView(id);
                var content= new ContentResult { Content = result, ContentType = "application/json" };
            return content;
        }
        public JsonResult GetBuildingList()
        {
            var list = BuildingListView.View();
            list = list.OrderBy(v =>  v.BuildingName);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetBuildingByNatamView()
        {
            var list = BuildingListView.ViewBuildingByNatam();
            list = list.OrderBy(v=>v.BuildingName);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetBuildingMedia(int BuildingId)
        {
            var list = MediaContext.ViewByBuilding(BuildingId);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetBuildingGrid(int pagesize, int pagenum, int QueryType, string Area, int DealType, int PurposeType, int AreaSizeMin, int AreaSizeMax, string BuildingName, int StreetId, string StreetNo, int CityCode, int OwnerId, int BuildingId)
        {
            switch (QueryType)
            {
                case 2://address
                    if (string.IsNullOrEmpty(BuildingName) && StreetId== 0 && CityCode==0)// && string.IsNullOrEmpty(BuildingStreet) && string.IsNullOrEmpty(City))
                        return QueryPager<BuildingQueryView>(null,pagesize, pagenum);
                    break;
            }
            if (string.IsNullOrEmpty(Area))
                Area = "all";

            CommonQuery query = new CommonQuery(Request);
            var list = BuildingContext.View(QueryType, query.PageSize, query.PageNum, Area, DealType, PurposeType, AreaSizeMin, AreaSizeMax, BuildingName, StreetId, StreetNo, CityCode, OwnerId, BuildingId, query.Sort, query.Filter);
            var row = list.FirstOrDefault<BuildingQueryView>();
            int totalRows = row == null ? 0 : row.TotalRows;
            return QueryPagerServer<BuildingQueryView>(list, totalRows, query.PageSize, query.PageNum);

            //string key = CacheKeys.GetQueryBuildingGrid(QueryType, Area, DealType, PurposeType, AreaSizeMin, AreaSizeMax, BuildingName, BuildingStreet, StreetNo, City,OwnerId, BuildingId);
            //int AgentId = Types.ToInt(Request["Agent"]);

            //IEnumerable<BuildingQueryView> list = (IEnumerable<BuildingQueryView>)CacheGet(key, CacheGroup.Building);

            //if (list == null)
            //{
            //    list = BuildingContext.View(QueryType, Area, DealType, PurposeType, AreaSizeMin, AreaSizeMax, BuildingName, BuildingStreet, StreetNo, City, OwnerId, BuildingId);
            //    if (list != null && list.Count() > 0)
            //    {
            //        CacheAdd(key, list, CacheGroup.Building);
            //    }
            //}
            //if (list == null)
            //{
            //    return QueryPager<BuildingQueryView>(new List<BuildingQueryView>(), pagesize, pagenum);
            //}
          
            //return QueryPager<BuildingQueryView>(list,pagesize, pagenum);
        }

       // [HttpPost]
        public ActionResult BuildingUnitGrid()
        {
            BuildingQuery query = new BuildingQuery(Request);

            //var json= Json(query, JsonRequestBehavior.AllowGet);

           // var js = Nistec.Serialization.JsonSerializer.Serialize(query);

            return View(query);
        }

        [HttpPost]
        public JsonResult GetBuildingUnitGrid(int pagesize, int pagenum, int QueryType, string Area, int DealType, int PurposeType, int AreaSizeMin, int AreaSizeMax, string BuildingName, int StreetId, string StreetNo, int CityCode, int OwnerId, int BuildingId, int AgentId)
        {
            switch (QueryType)
            {
                case 2://address
                    if (string.IsNullOrEmpty(BuildingName) && StreetId==0 && CityCode==0 )//string.IsNullOrEmpty(BuildingStreet) && string.IsNullOrEmpty(City))
                        return QueryPager<UnitGridView>(null, pagesize, pagenum);
                    break;
            }
            if (string.IsNullOrEmpty(Area))
                Area = "all";

            CommonQuery query = new CommonQuery(Request);
            var list = UnitContext.QueryView(QueryType, query.PageSize,query.PageNum, Area, DealType, PurposeType, AreaSizeMin, AreaSizeMax, BuildingName, StreetId, StreetNo, CityCode, OwnerId, BuildingId, AgentId,query.Sort,query.Filter);
            var row = list.FirstOrDefault<UnitGridView>();
            int totalRows = row == null ? 0 : row.TotalRows;
            return QueryPagerServer<UnitGridView>(list, totalRows, query.PageSize, query.PageNum);

            //string key = CacheKeys.GetQueryBuildingGrid(QueryType, Area, DealType, PurposeType, AreaSizeMin, AreaSizeMax, BuildingName, BuildingStreet, StreetNo, City, OwnerId, BuildingId);
            //int AgentId = Types.ToInt(Request["Agent"]);

            //IEnumerable<UnitGridView> list = (IEnumerable<UnitGridView>)CacheGet(key, CacheGroup.BuildingUnit);

            //if (list == null)
            //{
            //    list = UnitContext.QueryView(QueryType, Area, DealType, PurposeType, AreaSizeMin, AreaSizeMax, BuildingName, BuildingStreet, StreetNo, City, OwnerId, BuildingId);
            //    if (list != null && list.Count() > 0)
            //    {
            //        CacheAdd(key, list, CacheGroup.BuildingUnit);
            //    }
            //}
            //if (list == null)
            //{
            //   return QueryPager<UnitGridView>(new List<UnitGridView>(), pagesize, pagenum);
            //}
            //return QueryPager<UnitGridView>(list, pagesize, pagenum);

        }


        //[HttpPost]
        //public JsonResult GetBuildingGrid(int QueryType, string Area, int DealType, int PurposeType, int AreaSizeMin, int AreaSizeMax, string BuildingName, string BuildingStreet, int BuildingNo)
        //{
        //    //int AgentId = Types.ToInt(Request.Form["Agent"]);
        //    var list = BuildingQueryView.View(QueryType, Area, DealType, PurposeType, AreaSizeMin, AreaSizeMax, BuildingName, BuildingStreet, BuildingNo);
        //    return Json(list, JsonRequestBehavior.AllowGet);
        //}

        [HttpPost]
        // [ValidateAntiForgeryToken]
        public ActionResult UpdateBuilding()
        {


            //DateTime maxDate = new DateTime(2015, 1, 1);
            //if (Request.Form["birthDateValidate"] != null)
            //{
            //    var birthDateValidate = DateTime.Parse(Request.Form["birthDateValidate"], CultureInfo.CurrentCulture);
            //    if (birthDateValidate > maxDate)
            //    {
            //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            //    }
            //    else
            //    {
            //        return new HttpStatusCodeResult(HttpStatusCode.Accepted);
            //    }
            //}

            int res = 0;
            string action = "הגדרת בניין";
            BuildingView v = null;
            try
            {

                v = EntityContext.Create<BuildingView>(Request.Form);
                v.AgentId = GetUser();
                v.MailOnChanges = Types.ToBool(Request.Form["MailOnChanges"], false);

                EntityValidator validator = EntityValidator.ValidateEntity(v, "הגדרת בניין", "he");
                if (!validator.IsValid)
                {
                    return Json(GetFormResult(-1, action, validator.Result, v.BuildingId), JsonRequestBehavior.AllowGet);
                }

                //string key = string.Format("GetQueryBuildingGrid_{0}_{1}_{2}_{3}_{4}_{5}_{6}_{7}_{8}_{9}_{10}_{11}", v.QueryType, v.AreaId, v.de.DealType, v.PurposeType, v.AreaSizeMin, v.AreaSizeMax, v.BuildingName, v.BuildingStreet, v.StreetNo, v.City, v.OwnerId, v.BuildingId);
                //CacheRemove(key);

                res = BuildingContext.DoSave(v);

                return Json(FormResult.GetFormResult(res, action, v.BuildingId), JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(GetFormResult(-1, action, ex.Message, v.BuildingId), JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        public ActionResult UpdateBuildingNew()
        {

            int res = 0;
            string action = "הגדרת בניין";
            BuildingNewView v = null;
            try
            {

                v = EntityContext.Create<BuildingNewView>(Request.Form);
                v.AgentId = GetUser();
                v.SetPurposeType(Request.Form);

                if (v.PurposeType=="")
                {
                    return Json(GetFormResult(-1, action, "חובה לציין סוג נכס!", 0), JsonRequestBehavior.AllowGet);
                }

                EntityValidator validator = EntityValidator.ValidateEntity(v, "הגדרת בניין", "he");
                if (!validator.IsValid)
                {
                    return Json(GetFormResult(-1, action, validator.Result, v.BuildingId), JsonRequestBehavior.AllowGet);
                }

                res = BuildingContext.DoInsert(v);

                return Json(FormResult.GetFormResult(res, action, v.BuildingId), JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(GetFormResult(-1, action, ex.Message, v.BuildingId), JsonRequestBehavior.AllowGet);
            }

        }

        public ActionResult BuildingToActiveGrid()
        {
             return View();
        }

        [HttpPost]
        public ContentResult GetBuildingToActivateGrid()
        {
            string key = CacheKeys.GetBuildingToActivateGrid;

            //var bv = BuildingContext.Get(5);

            //string j= Nistec.Runtime.Json.JsonSerializer.ToJson(bv);

            //var bvj= Nistec.Runtime.Json.JsonSerializer.Deserialize<BuildingView>(j);

            //var aid= bvj.AgentId;


            string jlist = null;// (string)CacheGet(key);
            if (jlist == null)
            {
                jlist = BuildingContext.JsonBuildingToActivate();
                //if (jlist != null && jlist.Length > 0)
                //{
                //    CacheAdd(key, jlist);
                //}
            }

            //IList<Dictionary<string, object>> list = null;// (IList<Dictionary<string, object>>)CacheGet(key);

            //if (list == null)
            //{
            //    list = BuildingContext.ViewBuildingToActivate();
            //    //if (list != null && list.Count() > 0)
            //    //{
            //    //    CacheAdd(key, list);
            //    //}
            //}
            //var jlist = JsonConvert.SerializeObject(list, Newtonsoft.Json.Formatting.Indented);


            
            var content= new ContentResult { Content = jlist, ContentType = "application/json" };
            return content;
        }

        #endregion

        #region Unit

        public ActionResult UnitQuery()
        {
            return Authenticate(null);
        }

        [HttpGet]
        public ActionResult UnitGrid(int id, int floor,int op)
        {
            BuildingInfoView info =BuildingInfoView.View(id,floor,op);
            return View(info);
        }




        //public ActionResult UnitFloorGrid(int id, int floor)
        //{
        //    //int BuildingId = Types.ToInt(Request.Form["id"]);
        //    BuildingInfoView info = BuildingInfoView.View(id,floor);
        //    return View(info);
        //}
        //[HttpPost]
        //public JsonResult GetUnitFloorGrid(int BuildingId,int FloorNum)
        //{
        //    string key = string.Format("GetUnitFloorGrid_{0}_{1}", BuildingId, FloorNum);

        //    IEnumerable<UnitInfoView> list = (IEnumerable<UnitInfoView>)CacheGet(key);

        //    if (list == null)
        //    {
        //        list = UnitContext.ViewByBuildingFloor(BuildingId, FloorNum);
        //        if (list != null)
        //        {
        //            CacheAdd(key, list);
        //        }
        //    }

        //    return Json(list, JsonRequestBehavior.AllowGet);
        //}

        [HttpGet]
        public ActionResult RedirectToUnitDef(int id, int floor, int op)
        {
            int bid = UnitContext.Lookup_BuildingId(id);
            return RedirectToAction("UnitDef", new { id = id, bid = bid, floor = floor, op = op });
        }


        [HttpGet]
        public ActionResult UnitDef(int id, int bid, int floor, int op)
        {
            BuildingInfoView info =null;
            if(bid>0)
             info = BuildingInfoView.View(bid, floor, op);
            else
                info = BuildingInfoView.ViewByUnit(id); 
            return View(info);
        }

        [HttpPost]
        public JsonResult GetUnit(int id)
        {
            UnitView info = id > 0 ? UnitContext.Get(id) : new UnitView();
            return Json(info, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetUnitGrid(int pagesize, int pagenum, int BuildingId, int FloorNum,int PropertyType)
        {

            string key = CacheKeys.GetUnitGrid(BuildingId,FloorNum,PropertyType);

            IEnumerable<UnitInfoView> list = (IEnumerable<UnitInfoView>)CacheGet(key, CacheGroup.Building);

            if (list == null)
            {
                list = UnitContext.ViewByBuilding(BuildingId,FloorNum,PropertyType);
                if (list != null)
                {
                    CacheAdd(key, list, CacheGroup.Building);
                }
            }

            return QueryPager<UnitInfoView>(list,pagesize, pagenum);
        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        public ActionResult UpdateUnit()
        {

            int res = 0;
            string action = "הגדרת יחידה";
            UnitView v = null;
            try
            {
                v = EntityContext.Create<UnitView>(Request.Form);
                v.AgentId = GetUser();

                string key = CacheKeys.GetUnitGrid( v.BuildingId, v.FloorNum, v.PropertyType);
                CacheRemove(key, CacheGroup.Building);
                CacheRemove(CacheGroup.Property);
                if (v.PropertyType == 0)
                {
                    string floorkey = CacheKeys.GetFloorGrid(v.BuildingId);
                    CacheRemove(floorkey, CacheGroup.Building);
                }
                
                EntityValidator validator = EntityValidator.ValidateEntity(v, "הגדרת נכס", "he");
                if (!validator.IsValid)
                {
                    //return GoPrompt(-1, "unit", validator.Result);//UpdateResult("הבניין לא עודכן", validator.Result);
                    return Json(GetFormResult(-1, action, validator.Result, v.UnitId), JsonRequestBehavior.AllowGet);
                }

                res = UnitContext.DoSave(v);
                if (res == -2)
                {
                    var model = new ResultModel() { Status = res, Title = action, Message = "שטח היחידה חורג משטח הקומה", OutputId = v.UnitId };
                    return Json(model, JsonRequestBehavior.AllowGet);
                }

                //JsonResult result = new JsonResult();
                //result.Data = GetFormResult(res, action, null, v.UnitId);
                //result.ContentEncoding = System.Text.Encoding.UTF8;

                //if (!Request.AcceptTypes.Contains("application/json"))
                //    result.ContentType = "text/plain";
                //else
                //    result.ContentType = "application/json; charset=UTF-8";

                //return result;

                return Json(FormResult.GetFormResult(res, action, v.UnitId), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                //return GoPrompt(-1, "unit", ex.Message);
                return Json(GetFormResult(-1, action, ex.Message, v.UnitId), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        public JsonResult DeleteUnit(int UnitId, int BuildingId, int FloorNum, int PropertyType)
        {

            int res = 0;
            string action = "מחיקת יחידה";
            ResultModel model = null;
            try
            {
                string key = CacheKeys.GetUnitGrid(BuildingId, FloorNum, PropertyType);
                CacheRemove(key, CacheGroup.Building);
                if (PropertyType == 0)
                {
                    string floorkey =CacheKeys.GetFloorGrid(BuildingId);
                    CacheRemove(floorkey, CacheGroup.Building);
                }
                var userId=GetUser();
                res = UnitContext.DoDelete(UnitId, userId);
                if (res == -2)
                    model = new ResultModel() { Status = res, Title = action, Message = "שטח היחידה חורג משטח הקומה", OutputId = UnitId };
                else if (res == -3)
                    model = new ResultModel() { Status = res, Title = action, Message = "אין הרשאה למחיקת יחידה", OutputId = UnitId };
                else if (res == -1)
                    model = new ResultModel() { Status = res, Title = action, Message = "אירעה שגיאה היחידה לא הוסרה", OutputId = UnitId };
                else 
                    model = new ResultModel() { Status = res, Title = action, Message = "היחידה הוסרה", OutputId = UnitId };
            }
            catch (Exception ex)
            {
                model = new ResultModel() { Status = -1, Title = action, Message = "אירעה שגיאה " + ex.Message, OutputId = UnitId };
            }
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult PropertyToAdmin(int id)
        {
           int agentId = GetUser();
           int res = LeadsTrackingContext.DoMessager(id, 3, -9, agentId, 0, DateTime.Now);
           string result = res <= 0 ? "אירעה שגיאה לא עודכנו נתונים" : "בקשה לביצוע  עדכון מידע הועברה למנהל המערכת";
           return Json(GetFormResult(res, "עדכון מידע למנהל מערכת", result, 0), JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Plots

        [HttpGet]
        public ActionResult PlotsDef(int id = 0)
        {
            //var result = BuildingView.View(id);
            return Authenticate(id);
        }

        public ActionResult PlotsQuery()
        {
            return Authenticate(null);
        }
        [HttpGet]
        public ActionResult PlotsGrid()
        {
            return View();
        }

        public JsonResult GetPlots(int id)
        {
            if (id <= 0)
                return null;
            var result = PlotsContext.Get(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetMedia(int PlotsId)
        {
            var list = MediaContext.ViewByPlots(PlotsId);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetPlotsGrid()
        {
            string key = CacheKeys.GetPlotsGrid;
            //int AgentId = Types.ToInt(Request.Form["Agent"]);

            IEnumerable<PlotsView> list = (IEnumerable<PlotsView>)CacheGet(key, CacheGroup.Plots);

            if (list == null)
            {
                list = PlotsContext.ViewPlotsReport();
                if (list != null && list.Count() > 0)
                {
                    CacheAdd(key, list, CacheGroup.Plots);
                }
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        // [ValidateAntiForgeryToken]
        public ActionResult UpdatePlots()
        {

            int res = 0;
            string action = "הגדרת מגרש";
            PlotsView v = null;
            try
            {

                v = EntityContext.Create<PlotsView>(Request.Form);
                //v.AgentId = GetUser();
                //v.MailOnChanges = Types.ToBool(Request.Form["MailOnChanges"], false);

                EntityValidator validator = EntityValidator.ValidateEntity(v, "הגדרת מגרש", "he");
                if (!validator.IsValid)
                {
                    return Json(GetFormResult(-1, action, validator.Result, v.PlotsId), JsonRequestBehavior.AllowGet);
                }

                res = PlotsContext.DoSave(v);

                string key = CacheKeys.GetPlotsGrid;
                CacheRemove(key, CacheGroup.Plots);

                return Json(FormResult.GetFormResult(res, action, v.PlotsId), JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(GetFormResult(-1, action, ex.Message, v.PlotsId), JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        public JsonResult DeletePlots(int PlotsId)
        {

            int res = 0;
            string action = "הסרת מגרש";
            try
            {
                string key = CacheKeys.GetPlotsGrid;
                CacheRemove(key, CacheGroup.Plots);
                //res = FloorContext.DoDelete(FloorId);
                //FloorContext.DoRecalc(BuildingId);

                int userId = GetUser();
                res = PlotsContext.DoDelete(PlotsId, userId);
                string message = res > 0 ? "המגרש הוסר מרשימת המגרשים במערכת" : "המגרש לא הוסר מרשימת המגרשים במערכת";
                return Json(GetFormResult(res, action, message, PlotsId), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(GetFormResult(-1, action, ex.Message, PlotsId), JsonRequestBehavior.AllowGet);
            }
        }


        #endregion
 
        #region Media

        [HttpGet]
        public ActionResult _Media(int bid, int pid, string pt)
        {
            if(pid>0 && bid==0)
            {
                bid = UnitContext.Lookup_BuildingId(pid);
            }

            var model = new MediaModel() { BuildingId = bid, UnitId = pid, PropertyType = pt };
            return PartialView(model);
        }

        [HttpGet]
        public ActionResult Media(int bid, int pid,string pt)
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetMediaView(int buildingId, int propertyId, string propertyType)
        {
            var view = MediaContext.View(buildingId, propertyId, propertyType);
            return Json(view, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Investment

         public ActionResult InvestmentGrid()
        {
            return Authenticate(null);
        }

         [HttpGet]
         public ActionResult InvestmentDef(int id)
         {
             InvestmentView info = null;
             if (id > 0)
                 info = InvestmentContext.Get(id);
             else if (id > 0)
             {

             }
             return View(info);
         }

         [HttpPost]
         public JsonResult GetInvestmentGrid()
         {
             int pagesize = Types.ToInt(Request["pagesize"]);
             int pagenum = Types.ToInt(Request["pagenum"]);
             string sortfield = Request["sortdatafield"];
             string sortorder = Request["sortorder"] ?? "asc";

             var filterValue = Request["filtervalue0"];
             var filterCondition = Request["filtercondition0"];
             var filterDataField = Request["filterdatafield0"];
             var filterOperator = Request["filteroperator0"];


             string key = CacheKeys.GetInvestmentGrid;

             IEnumerable<InvestmentReport> list = (IEnumerable<InvestmentReport>)CacheGet(key, CacheGroup.Building);

             if (list == null)
             {
                 list = InvestmentContext.ViewReport();
                 if (list != null)
                 {
                     CacheAdd(key, list, CacheGroup.Building);
                 }
             }
             if (sortfield != null)
                 list = Sort<InvestmentReport>(list, sortfield, sortorder);

             if (filterValue != null)
             {
                 switch (filterDataField)
                 {
                     case "BuildingName":
                         list = list.Where(v => v.BuildingName != null && v.BuildingName.Contains(filterValue)); break;
                     case "Address":
                         list = list.Where(v => v.Address != null && v.Address.Contains(filterValue)); break;
                     case "City":
                         list = list.Where(v => v.City != null && v.City.Contains(filterValue)); break;

                 }
             }
             return QueryPager<InvestmentReport>(list, pagesize, pagenum);

         }

         [HttpPost]
         public JsonResult GetInvestmentEdit(int id, int bid, int uid)
         {
             InvestmentView view = null;
             if (id > 0)
             {
                 view = InvestmentContext.Get(id);
             }
             else if (uid > 0)
             {
                 view = InvestmentContext.GetByUnit(bid, uid);
                 if (view == null)
                     view = new InvestmentView() { BuildingId = bid, UnitId = id };
             }
             else
             {
                 view = InvestmentContext.GetByBuilding(bid);
                 if (view == null)
                     view = new InvestmentView() { BuildingId = bid };
             }
             return Json(view, JsonRequestBehavior.AllowGet);
         }

         [HttpPost]
         // [ValidateAntiForgeryToken]
         public JsonResult UpdateInvestment()
         {

             int res = 0;
             string action = "הגדרת השקעה";
             InvestmentView v = null;
             try
             {
                 v = EntityContext.Create<InvestmentView>(Request.Form);
                 //v.AgentId = GetUser();

                 EntityValidator validator = EntityValidator.ValidateEntity(v, action, "he");
                 if (!validator.IsValid)
                 {
                     return Json(GetFormResult(-1, action, validator.Result, v.InvestId), JsonRequestBehavior.AllowGet);
                 }
                 string key = CacheKeys.GetInvestmentGrid;
                 CacheRemove(key, CacheGroup.Building);

                 res = InvestmentContext.DoSave(v);
                 return Json(FormResult.GetFormResult(res, action, v.InvestId), JsonRequestBehavior.AllowGet);
             }
             catch (Exception ex)
             {
                 return Json(GetFormResult(-1, action, ex.Message, v.InvestId), JsonRequestBehavior.AllowGet);
             }
         }


        #endregion

        #region Floor

         public ActionResult FloorGrid(int id)
         {
             var name= BuildingContext.LookupBuildingName(id);

             var bv = BuildingContext.Get(id);

             var model = new BuildingFloorsModel() { BuildingId = id, BuildingName = bv.BuildingName, FloorNoDown=bv.FloorNoDown, FloorNoUp=bv.FloorNoUp };

             return Authenticate(model);
         }

        
         [HttpPost]
         public JsonResult GetFloorGrid()
         {
             int BuildingId = Types.ToInt(Request["id"]);
             
             //int pagesize = Types.ToInt(Request["pagesize"]);
             //int pagenum = Types.ToInt(Request["pagenum"]);
             //string sortfield = Request["sortdatafield"];
             //string sortorder = Request["sortorder"] ?? "asc";

             //var filterValue = Request["filtervalue0"];
             //var filterCondition = Request["filtercondition0"];
             //var filterDataField = Request["filterdatafield0"];
             //var filterOperator = Request["filteroperator0"];


             string key = CacheKeys.GetFloorGrid(BuildingId);

             IEnumerable<FloorReport> list = (IEnumerable<FloorReport>)CacheGet(key, CacheGroup.Building);

             if (list == null)
             {
                 list = FloorReport.ViewFloorReport(BuildingId);
                 if (list != null)
                 {
                     CacheAdd(key, list, CacheGroup.Building);
                 }
             }

             list = Sort<FloorReport>(list, "FloorNum", "asc");

             //if (sortfield != null)
             //    list = Sort<FloorReport>(list, sortfield, sortorder);

             //if (filterValue != null)
             //{
             //    switch (filterDataField)
             //    {
             //        case "FloorNum":
             //            int floornum = Types.ToInt(filterValue);
             //            list = list.Where(v => v.FloorNum != null && v.FloorNum==floornum); break;
             //    }
             //}
             //return QueryPager<FloorReport>(list, pagesize, pagenum);
             return Json(list, JsonRequestBehavior.AllowGet);
         }

         [HttpPost]
         public JsonResult GetFloorEdit(int floorId, int buildingId)
         {
             FloorView view = null;
             if (floorId > 0)
             {
                 view = FloorContext.Get(floorId);
             }
             else
             {
                     view = new FloorView() { BuildingId = buildingId };
             }
             return Json(view, JsonRequestBehavior.AllowGet);
         }

         [HttpPost]
         // [ValidateAntiForgeryToken]
         public JsonResult UpdateFloor()
         {

             int res = 0;
             string action = "הגדרת קומה";
             FloorView v = null;
             try
             {
                 v = EntityContext.Create<FloorView>(Request.Form);

                 EntityValidator validator = EntityValidator.ValidateEntity(v, action, "he");
                 if (!validator.IsValid)
                 {
                     return Json(GetFormResult(-1, action, validator.Result, v.FloorId), JsonRequestBehavior.AllowGet);
                 }
                 string key = CacheKeys.GetFloorGrid(v.BuildingId);
                 CacheRemove(key, CacheGroup.Building);
                 res = FloorContext.DoSave(v);
                 return Json(FormResult.GetFormResult(res, action, v.FloorId), JsonRequestBehavior.AllowGet);
             }
             catch (Exception ex)
             {
                 return Json(GetFormResult(-1, action, ex.Message, v.FloorId), JsonRequestBehavior.AllowGet);
             }
         }

         [HttpPost]
         // [ValidateAntiForgeryToken]
         public JsonResult DeleteFloor(int BuildingId,int FloorId)
         {

             int res = 0;
             string action = "מחיקת קומה";
             try
             {
                 string key = CacheKeys.GetFloorGrid(BuildingId);
                 CacheRemove(key, CacheGroup.Building);
                 //res = FloorContext.DoDelete(FloorId);
                 //FloorContext.DoRecalc(BuildingId);

                 int userId = GetUser();
                 res = FloorContext.DoDelete(FloorId, userId);

                 return Json(FormResult.GetFormResult(res, action, FloorId), JsonRequestBehavior.AllowGet);
             }
             catch (Exception ex)
             {
                 return Json(GetFormResult(-1, action, ex.Message, FloorId), JsonRequestBehavior.AllowGet);
             }
         }

         [HttpPost]
         // [ValidateAntiForgeryToken]
         public JsonResult RecalcFloor(int BuildingId)
         {

             int res = 0;
           
             try
             {
                 string key = CacheKeys.GetFloorGrid(BuildingId);
                 CacheRemove(key, CacheGroup.Building);
                 res = FloorContext.DoRecalc(BuildingId);
                 return Json(new ResultModel() { Status=res,Message="החישוב הסתיים" }, JsonRequestBehavior.AllowGet);
             }
             catch (Exception ex)
             {
                 return Json(new ResultModel() { Status = -1, Message = "אירעה שגיאה "+ex.Message }, JsonRequestBehavior.AllowGet);
             }
         }
         [HttpPost]
         // [ValidateAntiForgeryToken]
         public JsonResult FloorAdd(int BuildingId, int FloorNo, float FloorSize, int Purpose)
         {

             int res = 0;

             try
             {
                 string key = CacheKeys.GetFloorGrid(BuildingId);
                 CacheRemove(key, CacheGroup.Building);
                 if (FloorSize < 0)
                     FloorSize = 0;
                 //var view = new FloorView() { BuildingId = BuildingId, FloorNum = FloorNum, SumFloorArea=FloorSize,SumFloorFree=FloorSize, SumFloorRemain=FloorSize, SumFloorPopulate=0, About = true };
                 //res = FloorContext.DoInsert(view);
                 int userId = GetUser();
                 res = FloorContext.DoAdd(BuildingId, FloorNo, FloorSize, Purpose, userId);
                 //FloorContext.DoRecalc(BuildingId);
                 return Json(new ResultModel() { Status = res, Message = "עודכן בהצלחה" }, JsonRequestBehavior.AllowGet);
             }
             catch (Exception ex)
             {
                 return Json(new ResultModel() { Status = -1, Message = "אירעה שגיאה " + ex.Message }, JsonRequestBehavior.AllowGet);
             }
         }

         #endregion

        #region Building Wizard

         public ActionResult WizardBuilder(int id)
        {
            return View();
        }
        
        /*
         public ActionResult WizardFloorGrid2()
         {
             int res = 0;
             try
             {
                 int BuildingId = Types.ToInt(Request.Form["BuildingId"]);
                 int NumOfFloor = Types.ToInt(Request.Form["NumOfFloor"]);
                 int StartFloor = Types.ToInt(Request.Form["StartFloor"]);
                 int BuildingSize = Types.ToInt(Request.Form["BuildingSize"]);
                 int DefaultPurpose = Types.ToInt(Request.Form["DefaultPurpose"]);
                 float DefaultFloorHeight = Types.ToFloat(Request.Form["DefaultFloorHeight"],0);
                 float DefaultFloorArea = Types.ToFloat(Request.Form["DefaultFloorArea"],0);
                 string WizardKey = Request.Form["WizardKey"];// Guid.NewGuid().ToString();
                 
                 res = WizardContext.ExecWizard(WizardKey, BuildingId, NumOfFloor, StartFloor, BuildingSize, DefaultPurpose, DefaultFloorHeight, DefaultFloorArea);
                 
                 var name = BuildingContext.LookupBuildingName(BuildingId);
                 var model = new BuildingWizardModel() { BuildingId = BuildingId, BuildingName = name, WizardKey = WizardKey };

                 //var model = new BuildingWizardModel(Request.Form);

                 //if (res < 0)
                 //{
                 //    model.Message = "אירעה שגיאה קומות הבניין לא נוצרו";
                 //}
                 return View(model);
             }
             catch (Exception ex)
             {
                 var model = new BuildingWizardModel() { Message=ex.Message };

                 return View(model);
             }
         }
        */
         public ActionResult WizardFloorGrid()
         {
             int res = 0;
             try
             {
 
                 int BuildingId = Types.ToInt(Request.Form["BuildingId"]);
                 int FloorsUp = Types.ToInt(Request.Form["FloorsUp"]);
                 int FloorsDown = Types.ToInt(Request.Form["FloorsDown"]);
                 float FloorSize = Types.ToFloat(Request.Form["FloorSize"],0);
                 float FloorSizeUp = Types.ToFloat(Request.Form["FloorSizeUp"],0);
                 float FloorSizeDown = Types.ToFloat(Request.Form["FloorSizeDown"],0);
                
                 int DefaultPurpose = Types.ToInt(Request.Form["DefaultPurpose"]);
                 float DefaultFloorHeight = Types.ToFloat(Request.Form["DefaultFloorHeight"], 0);


                 res = WizardContext.ExecWizard(BuildingId, FloorsUp, FloorsDown, FloorSize, FloorSizeUp, FloorSizeDown, DefaultPurpose, DefaultFloorHeight);
                 
                 var name = BuildingContext.LookupBuildingName(BuildingId);
                 var model = new BuildingWizardModel() { BuildingId = BuildingId, BuildingName = name };

                 return View(model);
             }
             catch (Exception ex)
             {
                 var model = new BuildingWizardModel() { Message=ex.Message };

                 return View(model);
             }
         }




         [HttpPost]
         public JsonResult GetWizardFloorGrid(int BuildingId)//, int BuildingId, int NumOfFloor, int StartFloor, int BuildingSize, int DefaultPurpose, float DefaultFloorHeight, float DefaultFloorArea)
         {
             //string WizardKey = "4e7b1ada-d0bc-4bcd-9b57-f63a3648ccaa"; int BuildingId = 98; int NumOfFloor = 5; int StartFloor = 0; int BuildingSize = 0; int DefaultPurpose = 0; float DefaultFloorHeight = 0; float DefaultFloorArea = 0;

            // int res = WizardContext.ExecWizard(WizardKey, BuildingId, NumOfFloor, StartFloor, BuildingSize, DefaultPurpose, DefaultFloorHeight, DefaultFloorArea);
             var list = WizardContext.ViewBuildingFloors(BuildingId);
             return Json(list.OrderBy(v => v.FloorNum), JsonRequestBehavior.AllowGet);
         }

 
         [HttpPost]
         public ActionResult UpdateWizardFloor()
         {
             int res = 0;
             string action = "הגדרת קומה";
             WizardView v = null;
             try
             {
                 v = EntityContext.Create<WizardView>(Request.Form);

                 EntityValidator validator = EntityValidator.ValidateEntity(v, action, "he");
                 if (!validator.IsValid)
                 {
                     return Json(GetFormResult(-1, action, validator.Result, v.FloorNum), JsonRequestBehavior.AllowGet);
                 }
                 res = WizardContext.DoSave(v);
                 return Json(FormResult.GetFormResult(res, action, v.FloorNum), JsonRequestBehavior.AllowGet);
             }
             catch (Exception ex)
             {
                 return Json(GetFormResult(-1, action, ex.Message, v.FloorNum), JsonRequestBehavior.AllowGet);
             }
         }

         [HttpPost]
         public JsonResult ExecWizardToFloor(int BuildingId, bool Activate)
         {
             int res = 0;
             string message="";
             ResultModel model = null;
             try
             {
                 res = WizardContext.ExecWizardComplete(BuildingId, Activate);
                 switch (res)
                 {
                     case -1://--set @Status=-1 print 'Invalid Wizard details'
                         message = "חסרים פרטים לעדכון"; break;
                     case -2://--set @Status=-2 print 'Invalid Wizard building id'
                         message = "קוד בניין אינו תקין"; break;
                     case -3://--set @Status=-3 print 'Building floors allready defined' 
                         message = "הבניין כבר הוגדר כולל הגדרת קומות"; break;
                     case -4://--set @Status=-5 print 'Fields values is not valid'
                          message = "חסרים נתונים לעדכון או חלק מהערכים אינם תקינים"; break;
                     default://--set @Status=@@ROWCOUNT success; 
                         message = "בניית הבניין הסתיימה בהצלחה"; break;
                 }
                 model = new ResultModel() { Status = res, Title = "בניית בניין", Message = message };

                 return Json(model, JsonRequestBehavior.AllowGet);
             }
              catch (Exception ex)
             {
                 model = new ResultModel() { Status = res, Title = "בניית בניין", Message = ex.Message };

                 return Json(model, JsonRequestBehavior.AllowGet);
             }
         }

        //[HttpPost]
        //public ActionResult ExecBuildingWizard()
        //{
        //    int res = 0;
        //    try
        //    {
        //        int BuildingId = Types.ToInt(Request.Form["BuildingId"]);
        //        int NumOfFloor = Types.ToInt(Request.Form["NumOfFloor"]);
        //        int StartFloor = Types.ToInt(Request.Form["StartFloor"]);
        //        int BuildingSize = Types.ToInt(Request.Form["BuildingSize"]);
        //        int DefaultPurpose = Types.ToInt(Request.Form["DefaultPurpose"]);
        //        int DefaultFloorHeight = Types.ToInt(Request.Form["DefaultFloorHeight"]);
        //        int DefaultFloorArea = Types.ToInt(Request.Form["DefaultFloorArea"]);
        //        string WizardKey = Request.Form["WizardKey"];// Guid.NewGuid().ToString();

        //        res = WizardContext.ExecWizard(WizardKey, BuildingId, NumOfFloor, StartFloor, BuildingSize, DefaultPurpose, DefaultFloorHeight, DefaultFloorArea);
        //        if (res < 0)
        //            return Json("אירעה שגיאה קומות הבניין לא נוצרו", JsonRequestBehavior.AllowGet);

        //        return RedirectToAction("WizardFloorGrid", new { id = BuildingId, wk = WizardKey });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(ex.Message, JsonRequestBehavior.AllowGet);
        //    }
        //}


         [HttpPost]
         public JsonResult DoArchive(int BuildingId)
         {
             int res = 0;
             
             ResultModel model = null;
             try
             {
                 res = BuildingContext.DoActiveState(BuildingId, 5);
 
                 model = new ResultModel() { Status = res, Title = "ארכיון", Message = "הבניין עודכן" };

                 return Json(model, JsonRequestBehavior.AllowGet);
             }
             catch (Exception ex)
             {
                 model = new ResultModel() { Status = res, Title = "ארכיון", Message = ex.Message };

                 return Json(model, JsonRequestBehavior.AllowGet);
             }
         }


        

        #endregion

        #region Properties

         public ActionResult Query()
        {
            return Authenticate(null);
        }

        public ActionResult QueryGrid()
        {
            BuildingQuery query = new BuildingQuery(Request);
            return View(query);
        }


        public ActionResult QueryGridTable()
        {
            int AreaSizeMin = 0;
            int AreaSizeMax = 0;
            int ReportType = 0;
            int AgentId = Types.ToInt(Request.Form["agent_id"]);
            string Area = "all";// Request.Form["area"];
            string AreaSize = Request.Form["area-size"];
            ParseList(AreaSize, ref AreaSizeMin, ref AreaSizeMax);
            string Cities = Types.NZ(Request.Form["cities"], "all");
            int DealType = Types.ToInt(Request.Form["deal_type"]);
            int PurposeType = Types.ToInt(Request.Form["purpose_type"]);
            bool ShowNewOnly = Types.ToBool(Request.Form["show_new_only"], false);

            string building_name = Request.Form["building_name"];
            string building_street = Request.Form["building_street"];
            string building_num = Request.Form["building_num"];




            var list = DbNatam.Instance.GetBuildingQueryView(ReportType, AgentId, Area, AreaSizeMin, AreaSizeMax, Cities, DealType, PurposeType, ShowNewOnly);
            if (list != null)
                return View(list);
            return View();
        }

        public ActionResult QueryPopup(string showcase, int id)
        {
            //var data = mobjModel.GetCustomer(id);
            BuildingQueryView2 cust = new BuildingQueryView2()
            {
                ID = 123,
                BuildingName = "שם בניין חדש",
                BuildingCity = "עיר חדש",
                BuildingStreet = "רחוב חדש"
            };

            if (Request.IsAjaxRequest())
            {
                return View("QueryPopup", cust);
            }
            else

                return View(cust);
        }

        #endregion

        #region Prices

        public ActionResult _PricesGrid(int id)
        {
            return View();
        }
        [HttpPost]
        public ContentResult GetPricesGrid(int BuildingId)
        {
            var result = BuildingContext.BuildingPrices(BuildingId);
            return base.GetJsonResult(result);
        }
        [HttpPost]
        public JsonResult CalcBuildingPrices(int BuildingId)
        {
            var result = BuildingContext.CalcBuildingPrices(BuildingId);
            return Json(result);
        }
        

        #endregion

        #region Reports

        public ActionResult ReportQuery()
        {
            return Authenticate(null);
        }

        public ActionResult ReportExport()
        {
            ReportQuery query = new ReportQuery(Request);
            var list = query.ExportByQuery();
            if (list == null)
               return GoFinal("לא נמצאו נתונים");
            return CsvActionResult.ExportToCsv(list, query.ReportName);
        }
        public ActionResult ReportGrid()
        {
            ReportQuery query = new ReportQuery(Request);
            //var list = query.ExportByQuery();
            //if (list == null)
            //    return GoFinal("לא נמצאו נתונים");
            //return CsvActionResult.ExportToCsv(list, query.ReportName);

            return View(query);
        }

        public JsonResult GetReportGrid()
        {
            ReportQuery query = new ReportQuery(Request);
            var table = query.ReportByQuery();
            //if (list == null)
            //    return GoFinal("לא נמצאו נתונים");

            //return CsvActionResult.ExportToCsv(list, query.ReportName);

            //return QueryPager<UnitInfoView>(list, pagesize, pagenum);

            //string json = table == null ? null : JsonConvert.SerializeObject(table);//, Formatting.Indented);

            return Json(table, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Owners

        public ActionResult OwnersQueryGrid()
        {
            return Authenticate(null);
        }


        public ActionResult OwnersExport()
        {
            CustomerQuery query = new CustomerQuery(Request);
            var list = AccountContext.ExportByQuery(query.QueryType, query.NewsType, query.CustomerName, query.ContactName, query.AccType);
            return CsvActionResult.ExportToCsv(list, "Owners");
        }


        public ActionResult OwnersQuery()
        {
            return View();
        }

        [HttpGet]
        public ActionResult OwnerDef(int id, int acctype)
        {
            return View();
        }

        [HttpGet]
        public ActionResult Owners(int acctype)
        {
            return Authenticate(null);
        }
              

        #endregion

        public ActionResult ShowAddToList(int id)
        {
            return View();
        }
         public ActionResult ShowInfo(int id)
        {
            return View();
        }
         public ActionResult ShowPicture(int id)
        {
            return View();
        }
         public ActionResult ShowMap(int id)
        {
            return View();
        }
         public ActionResult ShowComment(int id)
        {
            return View();
        }
         public ActionResult ShowHistrtory(int id)
        {
            return View();
        }
         public ActionResult ShowUnitsDetails(int id)
        {
            return View();
        }
        
    }
}
