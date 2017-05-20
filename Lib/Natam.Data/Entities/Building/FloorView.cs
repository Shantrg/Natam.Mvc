using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;
using Nistec.Generic;
using Nistec;

namespace Pro.Data.Entities
{
    [Entity(EntityName = "FloorView", MappingName = "Crm_Building_Floors", ConnectionKey = "cnn_natam", EntityKey = new string[] { "FloorId" })]
    public class FloorContext : EntityContext<FloorView>
    {
        #region ctor

        public FloorContext()
        {
        }

        public FloorContext(int FloorId)
            : base(FloorId)
        {
        }

        #endregion

        #region update
        public static int DoSave(FloorView bv)
        {
            EntityValidator.Validate(bv, "השקעה", "he");

            using (FloorContext context = new FloorContext())
            {
                UpdateCommandType cmdtype = UpdateCommandType.Insert;
                if (bv.FloorId > 0)
                {
                    context.SetByParam("FloorId", bv.FloorId);
                    cmdtype = UpdateCommandType.Update;
                }
                context.Set(bv);
                return context.SaveChanges(cmdtype);
            }
        }
        /*
        public static int DoSave(int FloorId, FloorView bv, UpdateCommandType commandType)
        {
            if (commandType == UpdateCommandType.Delete)
                using (FloorContext context = new FloorContext(FloorId))
                {
                    return context.SaveChanges(commandType);
                }

            EntityValidator.Validate(bv, "הגדרת קומה", "he");

            if (commandType == UpdateCommandType.Insert)
                using (FloorContext context = new FloorContext())
                {
                    context.Set(bv);
                    return context.SaveChanges(commandType);
                }

            if (commandType == UpdateCommandType.Update)
                using (FloorContext context = new FloorContext(FloorId))
                {
                    context.Set(bv);
                    return context.SaveChanges(commandType);
                }
            return 0;
        }

        public static int DoInsert(FloorView bv)
        {
            EntityValidator.Validate(bv, "הגדרת קומה", "he");

            using (FloorContext context = new FloorContext())
            {
                context.Set(bv);
                return context.SaveChanges(UpdateCommandType.Insert);
            }
        }

        public static int DoUpdate(int FloorId, FloorView bv)
        {
            EntityValidator.Validate(bv, "הגדרת קומה", "he");

            using (FloorContext context = new FloorContext(FloorId))
            {
                context.Set(bv);
                return context.SaveChanges(UpdateCommandType.Update);
            }
        }
        */
        public static int DoDelete(int FloorId, int UserId)
        {
            //using (FloorContext context = new FloorContext(FloorId))
            //{
            //    return context.SaveChanges(UpdateCommandType.Delete);
            //}

            var parameters = DataParameter.GetSqlList("FloorId", FloorId, "UserId", UserId);
            DataParameter.AddOutputParameter(parameters, "Status", System.Data.SqlDbType.Int, 4);
            int res = DbNatam.Instance.ExecuteNonQuery("sp_Floor_Delete", parameters.ToArray(), System.Data.CommandType.StoredProcedure);
            return Types.ToInt(parameters[2].Value);

        }

        public static int DoAdd(int BuildingId, int FloorNo, float FloorSize, int Purpose, int UserId)
        {
            var parameters=DataParameter.GetSqlList("BuildingId", BuildingId, "FloorNo", FloorNo, "FloorSize", FloorSize, "Purpose", Purpose, "UserId", UserId);
            DataParameter.AddOutputParameter(parameters,"Status", System.Data.SqlDbType.Int,4);
            int res= DbNatam.Instance.ExecuteNonQuery("sp_Floor_Add", parameters.ToArray(), System.Data.CommandType.StoredProcedure);
            return Types.ToInt(parameters[5].Value);
        }

        public static int DoRecalc(int BuildingId)
        {
            return DbNatam.Instance.ExecuteNonQuery("sp_Recalc_Floor_Size", "BuildingId", BuildingId);

        }
        #endregion

        #region static

        public static FloorView Get(int BuildingId, int FloorNum)
        {
            using (FloorContext context = new FloorContext())
            {
                context.SetByParam("BuildingId", BuildingId, "FloorNum", FloorNum);
                return context.Entity;
            }
        }
        public static FloorView Get(int FloorId)
        {
            using (FloorContext context = new FloorContext(FloorId))
            {
                return context.Entity;
            }
        }
        public static IList<FloorView> GetByBuilding(int BuildingId)
        {
            using (FloorContext context = new FloorContext())
            {
                return context.EntityList("BuildingId", BuildingId);
            }
        }
        

        #endregion

    }

    public class FloorReport : FloorView
    {
        public static IList<FloorReport> ViewFloorReport(int BuildingId)
        {
          return  DbNatam.Instance.EntityItemList<FloorReport>("vw_Building_Floor", "BuildingId", BuildingId);
        }
        public string PurposeName { get; set; }
    }


    public class FloorView : IEntityItem
    {
        [EntityProperty(EntityPropertyType.Identity)]
        public int FloorId { get; set; }
        [EntityProperty(EntityPropertyType.Key)]
        [Validator("קוד בניין", true)]
        public int BuildingId { get; set; }
        [EntityProperty(EntityPropertyType.Key)]
        public int FloorNum { get; set; }
        public string FloorDescription { get; set; }
        public float FloorHeight { get; set; }
        //public int AreaType { get; set; }
        public int Purpose { get; set; }
        //public string Measure { get; set; }
        public float SumFloorArea { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public float SumFloorPopulate { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public float SumFloorFree { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public float SumFloorRemain { get; set; }
        public bool About { get; set; }
        public string Memo { get; set; }
        //public DateTime Creation { get; set; }
        //public DateTime LastUpdate { get; set; }

    }

}
