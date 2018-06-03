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
    [Entity(EntityName = "PlotsView", MappingName = "Crm_Plots", ConnectionKey = "cnn_natam", EntityKey = new string[] { "PlotsId" })]
    public class PlotsContext : EntityContext<PlotsView>
    {
        #region ctor

        public PlotsContext()
        {
        }

        public PlotsContext(int PlotsId)
            : base(PlotsId)
        {
        }

        #endregion

        #region update
        public static int DoUpdate(PlotsView bv)
        {
            EntityValidator.Validate(bv, "מגרשים", "he");

            using (PlotsContext context = new PlotsContext())
            {
                UpdateCommandType cmdtype = UpdateCommandType.Insert;
                if (bv.PlotsId > 0)
                {
                    context.SetByParam("PlotsId", bv.PlotsId);
                    cmdtype = UpdateCommandType.Update;
                }
                context.Set(bv);
                return context.SaveChanges(cmdtype);
            }
        }

        public static int DoSave(PlotsView pv)
        {
            var args = new object[]{
            "PlotsId", pv.PlotsId ,
            "AreaId", pv.AreaId ,
            "Street", pv.Street ,
            "StreetNo", pv.StreetNo ,
            "City", pv.City ,
            "Bloc", pv.Bloc ,
            "Lot", pv.Lot ,
            "Size", pv.Size ,
            "OwnerType", pv.OwnerType ,
            "Designation", pv.Designation ,
            "Rights", pv.Rights ,
            "Taba", pv.Taba ,
             "OwnerId", pv.OwnerId ,
            "Price", pv.Price ,
            "Memo", pv.Memo ,
            "AgentId", pv.AgentId 
            };
            var parameters = DataParameter.GetSql(args);
            parameters[0].Direction = System.Data.ParameterDirection.InputOutput;
            int res = DbNatam.Instance.ExecuteCommandNonQuery("sp_Plots_Save", parameters, System.Data.CommandType.StoredProcedure);
            pv.PlotsId = Types.ToInt(parameters[0].Value);
            return res;
        }

        public static int DoDelete(int PlotsId, int AgentId)
        {
            var parameters = DataParameter.GetSqlWithDirection("PlotsId", PlotsId, 0, "AgentId", AgentId, 0, "Status", 0, 2);
            //DataParameter.AddOutputParameter(parameters, "Status", System.Data.SqlDbType.Int, 4);
            int res = DbNatam.Instance.ExecuteCommandNonQuery("sp_Plots_Delete", parameters, System.Data.CommandType.StoredProcedure);
            return parameters.GetParameterValue<int>("Status");// Types.ToInt(parameters[2].Value);

        }

        #endregion

        #region static

        public static PlotsView Get(int PlotsId)
        {
            using (PlotsContext context = new PlotsContext(PlotsId))
            {
                return context.Entity;
            }
        }

        public static IList<PlotsReport> ViewPlotsReport()
        {
            return DbNatam.Instance.EntityItemList<PlotsReport>("vw_Plots");
        }

        #endregion

    }

    public class PlotsReport : PlotsView
    {
        public string AreaName { get; set; }
        public string OwnerTypeName { get; set; }
        public string OwnerName { get; set; }
        public string AgentName { get; set; }
        public string CityName { get; set; }
        public string StreetName { get; set; }

        //public string DesignationName { get; set; }
    }


    public class PlotsView : IEntityItem
    {

        [EntityProperty(EntityPropertyType.Identity)]
        public int PlotsId { get; set; }
        public int AreaId { get; set; }
        public string Street { get; set; }
        public int StreetId { get; set; }
        public string StreetNo { get; set; }
        public string City { get; set; }
        public int CityCode { get; set; }
        public string Bloc { get; set; }
        public string Lot { get; set; }
        public float Size { get; set; }
        public int OwnerType { get; set; }
        public string Designation { get; set; }
        public string Rights { get; set; }
        public string Taba { get; set; }
         public int OwnerId { get; set; }
        public float Price { get; set; }
        public string Memo { get; set; }
        public DateTime Creation { get; set; }
        public DateTime LastUpdate { get; set; }
        public int AgentId { get; set; }
        

    }

    public class OwnerType : IEntityItem
    {
        public string OwnerTypeId { get; set; }
        public string OwnerTypeName { get; set; }
    }

    public class Designation : IEntityItem
    {
        public string DesignationId { get; set; }
        public string DesignationName { get; set; }
    }
}
