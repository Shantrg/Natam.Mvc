using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;

namespace Pro.Data.Entities
{

    [Entity(EntityName = "MediaView", MappingName = "Crm_Media", ConnectionKey = "cnn_natam", EntityKey = new string[] { "MediaId" })]
    public class MediaContext : EntityContext<MediaView>
    {
        #region ctor

        public MediaContext()
        {
        }

        public MediaContext(int MediaId)
            : base(MediaId)
        {
        }

        #endregion

        #region update

        public static int DoSave(int id, MediaView bv, UpdateCommandType commandType)
        {
            if (commandType == UpdateCommandType.Delete)
                using (MediaContext context = new MediaContext(id))
                {
                    return context.SaveChanges(commandType);
                }

            EntityValidator.Validate(bv, "מדיה", "he");

            if (commandType == UpdateCommandType.Insert)
                using (MediaContext context = new MediaContext())
                {
                    context.Set(bv);
                    return context.SaveChanges(commandType);
                }

            if (commandType == UpdateCommandType.Update)
                using (MediaContext context = new MediaContext(id))
                {
                    context.Set(bv);
                    return context.SaveChanges(commandType);
                }
            return 0;
        }

        public static int DoSave(int id, MediaView bv)
        {
            EntityValidator.Validate(bv, "מדיה", "he");
            
            using (MediaContext context = new MediaContext())
            {
                UpdateCommandType cmdtype = UpdateCommandType.Insert;
                if (id > 0)
                {
                    context.SetEntity(id);
                    cmdtype = UpdateCommandType.Update;
                }
                context.Set(bv);
                return context.SaveChanges(cmdtype);
            }
        }

        public static int DoInsert(MediaView bv)
        {
            EntityValidator.Validate(bv, "מדיה", "he");

            using (MediaContext context = new MediaContext())
            {
                UpdateCommandType cmdtype = UpdateCommandType.Insert;
                context.Set(bv);
                return context.SaveChanges(cmdtype);
            }
        }

        public static int DoRemove(int id)
        {
            return DbNatam.Instance.ExecuteCommand("delete from Crm_Media where MediaId=@MediaId", System.Data.CommandType.Text, "MediaId", id);
        }

        #endregion

        #region static

        public static MediaView Get(int id)
        {
            using (MediaContext context = new MediaContext(id))
            {
                return context.Entity;
            }
        }

        public static string LookupByBuilding(int BuildingId)
        {
            string PropertyType = "b";
            return DbNatam.Instance.QueryScalar<string>("select top 1 MediaPath from Crm_Media where BuildingId=@BuildingId and PropertyType=@PropertyType", "", "BuildingId", BuildingId, "PropertyType", PropertyType);
        }
        public static string LookupByUnit(int UnitId)
        {
            string PropertyType = "u";
            return DbNatam.Instance.QueryScalar<string>("select top 1 MediaPath from Crm_Media where UnitId=@UnitId and PropertyType=@PropertyType", "", "UnitId", UnitId, "PropertyType", PropertyType);
        }
        public static string LookupByPlots(int PlotsId)
        {
            string PropertyType = "p";
            return DbNatam.Instance.QueryScalar<string>("select top 1 MediaPath from Crm_Media where UnitId=@UnitId and PropertyType=@PropertyType", "", "UnitId", PlotsId, "PropertyType", PropertyType);
        }

        public static bool MediaPropertyExists(int propertyId)
        {
            var res = ViewByProperty(propertyId);
            return res != null && res.Count() > 0;
        }
        public static bool MediaBuildingExists(int buildingId)
        {
            var res = ViewByBuilding(buildingId);
            return res != null && res.Count() > 0;
        }
        public static bool MediaPlotsExists(int buildingId)
        {
            var res = ViewByPlots(buildingId);
            return res != null && res.Count() > 0;
        }
        public static IEnumerable<MediaView> View(int buildingId, int propertyId, string propertyType)
        {
            if (propertyType == "u")
                return ViewByProperty(propertyId);
            if (propertyType == "b")
                return ViewByBuilding(buildingId);
            if (propertyType == "p")
                return ViewByPlots(propertyId);
            throw new ArgumentException("propertyType not supported " + propertyType);
        }
        public static IEnumerable<MediaView> ViewByBuilding(int BuildingId)
        {
            string PropertyType = "b";
            using (MediaContext context = new MediaContext())
            {
                return context.EntityList(DataFilter.GetSql("BuildingId=@BuildingId and PropertyType=@PropertyType", BuildingId, PropertyType));
            }
        }
        public static IEnumerable<MediaView> ViewByProperty(int UnitId)
        {
            using (MediaContext context = new MediaContext())
            {
                return context.EntityList(DataFilter.GetSql("UnitId=@UnitId", UnitId));
            }
        }

        public static IEnumerable<MediaView> ViewByPlots(int PlotsId)
        {
            string PropertyType = "p";
            using (MediaContext context = new MediaContext())
            {
                return context.EntityList(DataFilter.GetSql("UnitId=@UnitId and PropertyType=@PropertyType", PlotsId, PropertyType));
            }
        }
        #endregion

    }

    public class MediaView : IEntityItem
    {

        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int MediaId { get; set; }
        
        public int BuildingId { get; set; }
        
        public int UnitId { get; set; }
        
        public string PropertyType { get; set; }
        
        public string MediaType { get; set; }

        
        [Validator("נתיב מדיה",true)]
        public string MediaPath { get; set; }

        #endregion

    }
 
}
