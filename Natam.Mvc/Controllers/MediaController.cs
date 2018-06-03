using Pro.Models;
using Nistec.Web.Security;
using Nistec.Generic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
//using WebMatrix.WebData;
using Nistec.Web.Cms;
using Nistec.Data;
using Nistec;
using Pro.Data.Entities;
using System.IO;
using Natam.Mvc.Models;
using Nistec.Drawing;

namespace Natam.Mvc.Controllers
{
    [Authorize]
    public class MediaController : BaseController
    {
        bool EnableCache = false;
  
        private int GetMaxImageResize()
        {
            int size = NetConfig.AppSettings.Get<int>("ImageMaxResizeKb", 500);
            return size * 1024;
        }
        private int GetMaxSize(string mediaType)
        {
            int size = 0;
            switch(mediaType)
            {
                case "image":
                    size = NetConfig.AppSettings.Get<int>("ImageMaxSizeKb", 10200);break;
                case "video":
                    size = NetConfig.AppSettings.Get<int>("VideoMaxSizeKb", 1024); break;
                case "doc":
                    size = NetConfig.AppSettings.Get<int>("DocMaxSizeKb", 1024); break;
                default:
                    throw new Exception ("Media type not supported "+ mediaType);

            }
            return size * 1024;
        }

        public JsonResult MediaPropertyExists(int id)
        {
            var res = MediaContext.MediaPropertyExists(id);
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        public JsonResult MediaBuildingExists(int id)
        {
            var res = MediaContext.MediaBuildingExists(id);
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        public JsonResult MediaPlotsExists(int id)
        {
            var res = MediaContext.MediaPlotsExists(id);
            return Json(res, JsonRequestBehavior.AllowGet);
        }


        public string Upload()
        {
            //string appid = HttpContext.Current.Session["appid"].ToString();
            string returnTxt;
            int BuildingId = 0;
            int UnitId = 0;
            string picNo = "";
            string itemType = "";

            var parm = Request.Params;
            if (parm == null)
            {
                return "Invalid arguments";
            }

            BuildingId = Types.ToInt(parm["param1"]);
            UnitId = Types.ToInt(parm["param2"]);
            picNo = parm["param3"];
            itemType = parm["param4"];
            itemType = itemType.ToLower();

            string newfilename = string.Format("{0}_{1}_{2}_{3}", BuildingId, UnitId, itemType, picNo);

            string serverpath = Server.MapPath("~/uploads/" + itemType);

            if (!System.IO.Directory.Exists(serverpath))
            {
                System.IO.Directory.CreateDirectory(serverpath);
            }

            HttpFileCollectionBase uploadedFiles = Request.Files;
            returnTxt = string.Empty;

            for (int i = 0; i < uploadedFiles.Count; i++)
            {
                HttpPostedFileBase userPostedFile = uploadedFiles[i];

                try
                {
                    if (userPostedFile.ContentLength > 0)
                    {
                        //returnTxt += "<u>File #" + (i + 1) + "</u><br>";
                        //returnTxt += "File Content Type: " + userPostedFile.ContentType + "<br>";
                        //returnTxt += "File Size: " + userPostedFile.ContentLength + "kb<br>";
                        returnTxt += "File Name: " + userPostedFile.FileName;// +"<br>";
                        string extension = Path.GetExtension(userPostedFile.FileName);
                        //string postfix = UUID.NewId();
                        //string filename = string.Format("{0}_{1}{2}",newfilename,postfix,extension);
                        string filename = newfilename + extension;
                        string fullname = serverpath + "\\" + filename;
                        IoHelper.DeleteFile(fullname);

                        userPostedFile.SaveAs(fullname);
                        if (itemType == "unit")
                            UnitContext.DoSavePic(UnitId, picNo, filename);
                        returnTxt = filename;

                        //userPostedFile.SaveAs(filepath + "\\" + Path.GetFileName(userPostedFile.FileName));
                        //returnTxt += "Location where saved: " + filepath + "\\" + Path.GetFileName(userPostedFile.FileName) + "<p>";
                        break;
                    }
                }
                catch (Exception Ex)
                {
                    returnTxt += "Error: " + Ex.Message;
                }
            }
            //returnTxt = returnTxt.Replace("<","@lt;").Replace(">","@gt;");
            return returnTxt;
        }

        public ResultModel Remove(string id, string itemType, string pic, string filename)
        {
            string filepath = Server.MapPath("~/uploads/" + itemType);
            string fullname = Path.Combine(filepath, filename);
            try
            {
                IoHelper.DeleteFile(fullname);
                int Id = Types.ToInt(id);
                if (itemType == "unit")
                    UnitContext.DoSavePic(Id, pic, "");
                return new ResultModel() { Status = 1, Message = fullname, Title = "file removed" };
            }
            catch (Exception ex)
            {
                return new ResultModel() { Status = -1, Message = ex.Message, Title = "file remove error" };
            }
        }

        private string GetMediaType(string extension)
        {
            if (extension == null)
                return "none";
            switch (extension.ToLower())
            {
                case ".jpg":
                case ".jpeg":
                case ".png":
                case ".gif":
                case ".tif":
                    return "img";
                case ".mp4":
                case ".avi":
                    return "video";
                case ".pdf":
                case ".doc":
                case ".docx":
                case ".xls":
                case ".xlsx":
                case ".txt":
                case ".html":
                    return "doc";
                default:
                    return "none";
            }
        }

        private bool IsImage(string extension)
        {
            if (extension == null)
                return false;
            switch (extension.ToLower())
            {
                case ".jpg":
                case ".jpeg":
                case ".png":
                case ".gif":
                case ".tif":
                    return true;
                default:
                    return false;
            }
        }

        public JsonResult MediaUpload()
        {
            //string appid = HttpContext.Current.Session["appid"].ToString();

            int BuildingId = 0;
            int UnitId = 0;
            string itemType = "";
            ResultModel model = null;
            try
            {

                var parm = Request.Params;
                if (parm == null)
                {
                    throw new Exception("Invalid arguments");
                }

                BuildingId = Types.ToInt(parm["param1"]);
                UnitId = Types.ToInt(parm["param2"]);
                itemType = parm["param3"];
                itemType = itemType.ToLower();

                HttpFileCollectionBase uploadedFiles = Request.Files;
                int maxImageResize = GetMaxImageResize();
                int fileUploaded = 0;
                int fileNone = 0;
                for (int i = 0; i < uploadedFiles.Count; i++)
                {
                    HttpPostedFileBase userPostedFile = uploadedFiles[i];

                    if (userPostedFile.ContentLength > 0)
                    {
                        string src = userPostedFile.FileName;
                        string extension = Path.GetExtension(src);
                        string mediaType = GetMediaType(extension);
                        if (mediaType == "none")
                        {
                            fileNone++;
                            continue;
                        }
                        string picNo = UUID.NewId();
                        string newfilename = string.Format("{0}_{1}_{2}_{3}", BuildingId, UnitId, itemType, picNo);
                        string serverpath = Server.MapPath("~/uploads/" + mediaType);

                        if (!System.IO.Directory.Exists(serverpath))
                        {
                            System.IO.Directory.CreateDirectory(serverpath);
                        }

                        string filename = newfilename + extension;
                        string fullname = serverpath + "\\" + filename;

                        if (IsImage(extension))
                        {
                            ImageResizer.Save(userPostedFile.InputStream, userPostedFile.FileName, fullname, maxImageResize, true);
                        }
                        else
                        {
                            int maxSizeAllowed = GetMaxSize(mediaType);
                            if (ImageResizer.GetImageSize(userPostedFile.InputStream) > maxSizeAllowed)
                            {
                                throw new Exception("File size not allowed!");
                            }
                            userPostedFile.SaveAs(fullname);
                        }

                        MediaView view = new MediaView()
                        {
                            BuildingId = BuildingId,
                            UnitId = UnitId,
                            PropertyType = itemType,
                            MediaType = mediaType,
                            MediaPath = filename
                        };
                        int res = MediaContext.DoInsert(view);
                        if (res > 0)
                            fileUploaded++;
                    }

                }
                string returnTxt = "";
                if (fileUploaded > 0)
                    returnTxt += string.Format("Added {0} files, ", fileUploaded);
                if(fileNone>0)
                    returnTxt += string.Format("Not allowed {1} files", fileNone);

                //returnTxt = string.Format("Added {0} files,Not allowed {1} files", fileUploaded, fileNone);

                //return new ResultModel() { Status = fileUploaded, Message = returnTxt, Title = "media added" };

                model = new ResultModel() { Status = fileUploaded, Message = returnTxt, Title = "media upload" };
            }
            catch (Exception ex)
            {
                model = new ResultModel() { Status = -1, Message = ex.Message, Title = "file upload error" };

            }
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        public JsonResult MediaRemove(string id, string mediaType, string filename)
        {
            string filepath = Server.MapPath("~/uploads/" + mediaType);
            string fullname = Path.Combine(filepath, filename);
            int res = 0;
            ResultModel model = null;
            try
            {
                IoHelper.DeleteFile(fullname);
                int fileId = Types.ToInt(id);
                res = MediaContext.DoRemove(fileId);
                model = new ResultModel() { Status = res, Title = "file remove", Message = filename + " removed", Link = null, OutputId = fileId };

            }
            catch (Exception ex)
            {
                model= new ResultModel() { Status = -1, Message = ex.Message, Title = "file remove error" };
            }

            return Json(model, JsonRequestBehavior.AllowGet);

        }


        public string UploadMulti()
        {
            string appid = "";// HttpContext.Current.Session["appid"].ToString();
            string returnTxt;
            int itemId = 0;
            string picNo = "";
            string itemType = "";

            var parm = Request.Params;
            if (parm == null)
            {
                itemId = Types.ToInt(parm["param1"]);
                picNo = parm["param2"];
                itemType = parm["param3"];
            }

            string filename = string.Format("{0}_{1}_{2}", itemId, picNo, itemType);

            if (!System.IO.Directory.Exists(Server.MapPath(@"~/uploads/" + appid)))
            {
                System.IO.Directory.CreateDirectory(Server.MapPath(@"~/uploads/" + appid));
            }

            string filepath = Server.MapPath("~/uploads/" + appid);
            HttpFileCollectionBase uploadedFiles = Request.Files;
            returnTxt = string.Empty;

            for (int i = 0; i < uploadedFiles.Count; i++)
            {
                HttpPostedFileBase userPostedFile = uploadedFiles[i];

                try
                {
                    if (userPostedFile.ContentLength > 0)
                    {
                        //returnTxt += "<u>File #" + (i + 1) + "</u><br>";
                        //returnTxt += "File Content Type: " + userPostedFile.ContentType + "<br>";
                        //returnTxt += "File Size: " + userPostedFile.ContentLength + "kb<br>";
                        returnTxt += "File Name: " + userPostedFile.FileName;// +"<br>";

                        userPostedFile.SaveAs(filepath + "\\" + Path.GetFileName(userPostedFile.FileName));
                        //returnTxt += "Location where saved: " + filepath + "\\" + Path.GetFileName(userPostedFile.FileName) + "<p>";
                    }
                }
                catch (Exception Ex)
                {
                    returnTxt += "Error: <br>" + Ex.Message;
                }
            }
            //returnTxt = returnTxt.Replace("<","@lt;").Replace(">","@gt;");
            return returnTxt;
        }

    }
}
