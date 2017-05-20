using Pro.Lib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Natam.Mvc.Controllers
{
    [Authorize]
    public class ReportsController : BaseController
    {
        public ActionResult BuildingDlg()
        {
            return View();
        }
        public ActionResult ReportDlg()
        {
            return View();
        }
        public ActionResult ReportGrid()
        {
            return View();
        }
        public ActionResult StatisticDlg()
        {
            return View();
        }
 
    }
}
