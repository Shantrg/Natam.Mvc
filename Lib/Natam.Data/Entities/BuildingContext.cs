using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Nistec.Data.Entities;
using Nistec.Data.Factory;
using Nistec.Data;
using Pro.Data;


namespace Pro.Data.Entities
{
   
    [Entity(EntityName = "BuildingView", MappingName = "vw_Buildings", ConnectionKey = "cnn_natam", EntityKey = new string[] { "Building_ID" })]
    [Serializable]
    public class BuildingViewContext : EntityContext<BuildingView>
    {

        #region ctor

        public BuildingViewContext()
        {
        }

        public BuildingViewContext(int Building_ID)
            : base(Building_ID)
        {
        }

        public static BuildingView Get(int id)
        {
            using (BuildingViewContext context = new BuildingViewContext(id))
            {
                return context.Entity;
            }
        }

        public static DataTable GetList()
        {
            DataTable dt = null;
            using (IDbCmd cmd = DbNatam.Instance.NewCmd())
            {
                dt = cmd.ExecuteCommand<DataTable>("select top 10 * from Person.Contact", true);
            }

            return dt;
        }

        public static IList<BuildingView> GetItems()
        {
            using (BuildingViewContext context = new BuildingViewContext())
            {
               return context.EntityList();
            }
        }

        #endregion

        #region binding

        //public override string GetCulture()
        //{
        //    return AdventureWorksResources.GetCulture();
        //}

        protected override void EntityBind()
        {
            base.EntityDb.EntityCulture = NatamLocalizer.GetCulture();
            //If EntityAttribute not define you can initilaize the entity here
            //base.InitEntity<AdventureWorks>("Contact", "Person.Contact", EntityKeys.Get("ContactID"));
        }

        #endregion

    }

}
