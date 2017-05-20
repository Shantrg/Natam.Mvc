using Pro.Data.Entities;
using Natam.Mvc.Models;
using Nistec;
using Nistec.Generic;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace Natam.Mvc.Ws
{
   
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 

    [System.Web.Script.Services.ScriptService]
    public class UploadFiles : System.Web.Services.WebService
    {

        public UploadFiles()
        {

            //Uncomment the following line if using designed components 
            //InitializeComponent(); 
        }

        [WebMethod(EnableSession = true)]
        public string Upload()
        {
            //string appid = HttpContext.Current.Session["appid"].ToString();
            string returnTxt;
            int BuildingId = 0;
            int UnitId = 0;
            string picNo = "";
            string itemType = "";

            var parm = HttpContext.Current.Request.Params;
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

            HttpFileCollection uploadedFiles = HttpContext.Current.Request.Files;
            returnTxt = string.Empty;

            for (int i = 0; i < uploadedFiles.Count; i++)
            {
                HttpPostedFile userPostedFile = uploadedFiles[i];

                try
                {
                    if (userPostedFile.ContentLength > 0)
                    {
                        //returnTxt += "<u>File #" + (i + 1) + "</u><br>";
                        //returnTxt += "File Content Type: " + userPostedFile.ContentType + "<br>";
                        //returnTxt += "File Size: " + userPostedFile.ContentLength + "kb<br>";
                        returnTxt += "File Name: " + userPostedFile.FileName;// +"<br>";
                        string extension=Path.GetExtension(userPostedFile.FileName);
                        //string postfix = UUID.NewId();
                        //string filename = string.Format("{0}_{1}{2}",newfilename,postfix,extension);
                        string filename = newfilename+extension;
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

        [WebMethod(EnableSession = true)]
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

        [WebMethod(EnableSession = true)]
        public ResultModel MediaUpload()
        {
            //string appid = HttpContext.Current.Session["appid"].ToString();

            int BuildingId = 0;
            int UnitId = 0;
            string itemType = "";

            try
            {

                var parm = HttpContext.Current.Request.Params;
                if (parm == null)
                {
                    throw new Exception("Invalid arguments");
                }

                BuildingId = Types.ToInt(parm["param1"]);
                UnitId = Types.ToInt(parm["param2"]);
                itemType = parm["param3"];
                itemType = itemType.ToLower();

                HttpFileCollection uploadedFiles = HttpContext.Current.Request.Files;

                int fileUploaded = 0;
                int fileNone = 0;
                for (int i = 0; i < uploadedFiles.Count; i++)
                {
                    HttpPostedFile userPostedFile = uploadedFiles[i];

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

                        userPostedFile.SaveAs(fullname);

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
                string returnTxt = string.Format("Added {0} files,Not allowed {1} files", fileUploaded, fileNone);
                return new ResultModel() { Status = fileUploaded, Message = returnTxt, Title = "media added" };
            }
            catch (Exception ex)
            {
                return new ResultModel() { Status = -1, Message = ex.Message, Title = "file upload error" };

            }
        }

        [WebMethod(EnableSession = true)]
        public ResultModel MediaRemove(string id, string mediaType, string filename)
        {
            string filepath = Server.MapPath("~/uploads/" + mediaType);
            string fullname = Path.Combine(filepath, filename);
            try
            {
                IoHelper.DeleteFile(fullname);
                int Id = Types.ToInt(id);
                MediaContext.DoRemove(Id);
                return new ResultModel() { Status = 1, Message = fullname, Title = "file removed" };
            }
            catch (Exception ex)
            {
                return new ResultModel() { Status = -1, Message = ex.Message, Title = "file remove error" };
            }
        }


        [WebMethod(EnableSession = true)]
        public string UploadMulti()
        {
            string appid = "";// HttpContext.Current.Session["appid"].ToString();
            string returnTxt;
            int itemId = 0;
            string picNo = "";
            string itemType = "";

            var parm = HttpContext.Current.Request.Params;
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
            HttpFileCollection uploadedFiles = HttpContext.Current.Request.Files;
            returnTxt = string.Empty;

            for (int i = 0; i < uploadedFiles.Count; i++)
            {
                HttpPostedFile userPostedFile = uploadedFiles[i];

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
