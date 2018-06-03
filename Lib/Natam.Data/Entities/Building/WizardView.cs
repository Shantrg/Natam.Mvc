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
    [Entity(EntityName = "WizardView", MappingName = "Crm_Building_Wizard_Floor", ConnectionKey = "cnn_natam", EntityKey = new string[] { "BuildingId","FloorNum" })]
    public class WizardContext : EntityContext<WizardView>
    {
        #region ctor

        public WizardContext()
        {
        }

        public WizardContext(int BuildingId, int FloorNum)//, string WizardKey)
            : base(BuildingId, FloorNum)//, WizardKey)
        {
        }

        #endregion

        #region update

        public static int DoSave(WizardView bv)
        {

            using (WizardContext context = new WizardContext(bv.BuildingId, bv.FloorNum))//, bv.WizardKey))
            {
                context.Set(bv);
                return context.SaveChanges(UpdateCommandType.Update);
            }
        }

        #endregion

        #region static

        public static int ExecWizard(int BuildingId, int FloorsUp, int FloorsDown, float FloorSize, float FloorSizeUp, float FloorSizeDown, int DefaultPurpose, float DefaultFloorHeight)
        {
            var parameters = new object[] { "BuildingId", BuildingId, "FloorsUp", FloorsUp, "FloorsDown", FloorsDown, "FloorSize", FloorSize, "FloorSizeUp", FloorSizeUp, "FloorSizeDown", FloorSizeDown, "DefaultPurpose", DefaultPurpose, "DefaultFloorHeight", DefaultFloorHeight };
            return DbNatam.Instance.ExecuteNonQuery("sp_Building_Wizard_Builder", parameters);
        }

        public static int ExecWizardComplete(int BuildingId, bool Activate)
        {
            var parameters = DataParameter.GetSqlList("BuildingId", BuildingId, "Activate", Activate);
            DataParameter.AddOutputParameter(parameters, "Status", System.Data.SqlDbType.Int, 4);
            DbNatam.Instance.ExecuteCommandNonQuery("sp_Building_Wizard_Complete", parameters.ToArray(), System.Data.CommandType.StoredProcedure);
            var res = Types.ToInt(parameters[2].Value);
            return res;
        }


        //public static int ExecWizard2(string WizardKey, int BuildingId, int NumOfFloor, int StartFloor, float BuildingSize, int DefaultPurpose, float DefaultFloorHeight, float DefaultFloorArea)
        //{
        //    var parameters = new object[] { "WizardKey", WizardKey, "BuildingId", BuildingId, "NumOfFloor", NumOfFloor, "StartFloor", StartFloor, "BuildingSize", BuildingSize, "DefaultPurpose", DefaultPurpose, "DefaultFloorHeight", DefaultFloorHeight, "DefaultFloorArea", DefaultFloorArea };
        //    return DbNatam.Instance.ExecuteNonQuery("sp_Building_Wizard", parameters);
        //}
        //public static int ExecWizardToFloor(string WizardKey)
        //{
        //    var parameters = DataParameter.GetSqlList("WizardKey", WizardKey);
        //    DataParameter.AddOutputParameter(parameters, "Status", System.Data.SqlDbType.Int, 4);
        //    DbNatam.Instance.ExecuteNonQuery("sp_Building_Wizard_ToFloor", parameters.ToArray(),  System.Data.CommandType.StoredProcedure);
        //    var res = Types.ToInt(parameters[1].Value);
        //    return res;
        //}
        public static IEnumerable<WizardGridView> ViewBuildingFloors(int BuildingId)
        {
            var parameters = new object[] { "BuildingId", BuildingId };
            return DbNatam.Instance.EntityItemList<WizardGridView>("vw_Wizard_Floor", parameters);
        }


        #endregion
    }

    public class WizardGridView : WizardView
    {
        public string PurposeName { get; set; }
    }

    public class WizardView : IEntityItem
    {

        [EntityProperty(EntityPropertyType.Key)]
        [Validator("קוד בניין", true)]
        public int BuildingId { get; set; }
        [EntityProperty(EntityPropertyType.Key)]
        public int FloorNum { get; set; }
        //[EntityProperty(EntityPropertyType.Key)]
        //public string WizardKey { get; set; }
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
