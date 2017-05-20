using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;
using Nistec.Generic;

namespace Pro.Data.Entities
{
    [Entity(EntityName = "InvestmentView", MappingName = "Crm_Investment", ConnectionKey = "cnn_natam", EntityKey = new string[] { "BuildingId,UnitId" })]
    public class InvestmentContext : EntityContext<InvestmentView>
    {
        #region ctor

        public InvestmentContext()
        {
        }

        public InvestmentContext(int BuildingId,int UnitId)
            : base( BuildingId, UnitId)
        {
        }

        #endregion

        #region update
        public static int DoSave(InvestmentView bv)
        {
            EntityValidator.Validate(bv, "השקעה", "he");

            using (InvestmentContext context = new InvestmentContext())
            {
                UpdateCommandType cmdtype = UpdateCommandType.Insert;
                if (bv.InvestId > 0)
                {
                    context.SetByParam("InvestId", bv.InvestId);
                    cmdtype = UpdateCommandType.Update;
                }
                context.Set(bv);
                return context.SaveChanges(cmdtype);
            }
        }
        public static int DoSave(int BuildingId, int UnitId, InvestmentView bv, UpdateCommandType commandType)
        {
            if (commandType == UpdateCommandType.Delete)
                using (InvestmentContext context = new InvestmentContext(BuildingId, UnitId))
                {
                    return context.SaveChanges(commandType);
                }

            EntityValidator.Validate(bv, "סוג השקעה", "he");

            if (commandType == UpdateCommandType.Insert)
                using (InvestmentContext context = new InvestmentContext())
                {
                    context.Set(bv);
                    return context.SaveChanges(commandType);
                }

            if (commandType == UpdateCommandType.Update)
                using (InvestmentContext context = new InvestmentContext(BuildingId, UnitId))
                {
                    context.Set(bv);
                    return context.SaveChanges(commandType);
                }
            return 0;
        }

        public static int DoInsert(InvestmentView bv)
        {
            EntityValidator.Validate(bv, "סוג השקעה", "he");

            using (InvestmentContext context = new InvestmentContext())
            {
                context.Set(bv);
                return context.SaveChanges(UpdateCommandType.Insert);
            }
        }

        public static int DoUpdate(int BuildingId, int UnitId, InvestmentView bv)
        {
            EntityValidator.Validate(bv, "סוג השקעה", "he");

            using (InvestmentContext context = new InvestmentContext(BuildingId, UnitId))
            {
                context.Set(bv);
                return context.SaveChanges(UpdateCommandType.Update);
            }
        }

        public static int DoDelete(int BuildingId, int UnitId)
        {
            using (InvestmentContext context = new InvestmentContext(BuildingId, UnitId))
            {
                return context.SaveChanges(UpdateCommandType.Delete);
            }
        }

        #endregion

        #region static

        public static InvestmentView Get(int BuildingId, int UnitId)
        {
            using (InvestmentContext context = new InvestmentContext(BuildingId, UnitId))
            {
                return context.Entity;
            }
        }
        public static InvestmentView Get(int InvestId)
        {
            using (InvestmentContext context = new InvestmentContext())
            {
                context.SetByParam("InvestId", InvestId);
                return context.Entity;
            }
        }
        public static InvestmentView GetByBuilding(int BuildingId)
        {
            using (InvestmentContext context = new InvestmentContext())
            {
                context.SetByParam("BuildingId", BuildingId, "UnitId", 0);
                return context.Entity;
            }
        }
        public static InvestmentView GetByUnit(int BuildingId, int UnitId)
        {
            using (InvestmentContext context = new InvestmentContext())
            {
                context.SetByParam("BuildingId", BuildingId, "UnitId", UnitId);
                return context.Entity;
            }
        }
        public static IEnumerable<InvestmentReport> ViewReport()
        {
            return DbNatam.Instance.Query<InvestmentReport>("select * from vw_Investments", null);

        }
       
        #endregion

    }

    public class InvestmentReport : InvestmentView
    {
        public float Yields { get; set; }
        public string BuildingName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string AgentName { get; set; }
    }

    public class InvestmentView : IEntityItem
    {
        [EntityProperty(EntityPropertyType.Identity)]
        public int InvestId { get; set; }
        [EntityProperty(EntityPropertyType.Key)]
        [Validator("קוד בניין", true)]
        public int BuildingId { get; set; }
        [EntityProperty(EntityPropertyType.Key)]
        public int UnitId { get; set; }
        public bool AllBuilding { get; set; }
        public int TypeOfInvestment { get; set; }
        [Validator("שטח", true)]
        public int SizeOfInvestment { get; set; }
        [Validator("תאור",false)]
        public string DescreptionHeb { get; set; }
        public bool IsYields { get; set; }
        public float RevenuesOfYear { get; set; }
        public float RequestedPrice { get; set; }
        public string Comment { get; set; }
        public DateTime Creation { get; set; }
        public DateTime LastUpdate { get; set; }

    }
 
}
