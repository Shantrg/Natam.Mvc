using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Nistec.Data;
using System.Globalization;
using Nistec.Data.Factory;
using Nistec.Data.Entities.Cache;
using Nistec.Generic;
using Pro.Data.Entities;
using System.Data;

namespace Pro.Data
{
    #region ResourceLang

    [Serializable]
    public class NatamLocalizer : EntityLocalizer
    {
        public static CultureInfo GetCulture()
        {
            return new CultureInfo("he-IL");
        }
        #region override

        protected override string CurrentCulture()
        {
            return GetCulture().Name;
        }

        protected override void BindLocalizer()
        {
            //init by config key
            //base.Init(CurrentCulture(), "Pro.Data.Resources.Natam_Crm");
            //or
            base.Init("Pro.Resources.NatamCrm");
            //or
            //base.Init(Nistec.Sys.NetResourceManager.GetResourceManager("Natam,Data.Resources.Natam_Crm", this.GetType()));
            //or
            //base.Init(Nistec.Sys.NetResourceManager.GetResourceManager( "Natam,Data.Resources.Natam_Crm",this.GetType()));
        }
        #endregion
    }
    #endregion

    #region DbContext
    [DbContext("cnn_natam")]
    [Serializable]
    public partial class DbNatam : DbContext
    {
        #region static

        public const bool EnableCache = true;
        //private static readonly DbNatam _instance = new DbNatam();

        public static DbNatam Instance
        {
            get { return new DbNatam(); }// _instance; }
        }

        public static string Cnn
        {
            get { return NetConfig.ConnectionString("cnn_natam"); }
        }

        public DbNatam()
        {
        }

        #endregion

        #region override

        protected override void EntityBind()
        {
            //base.SetConnection("cnn_natam");//, Cnn, DBProvider.SqlServer);
            //base.Items.SetEntity("Contact", "Person.Contact", EntitySourceType.Table, new EntityKeys("ContactID"));
            //base.SetEntity<ActiveContact>();
        }

        public override ILocalizer Localization
        {
            get
            {
                return base.GetLocalizer<NatamLocalizer>();
            }
        }

       

        #endregion

        #region Entities

        static EntityDbCache cache;

        public EntityDbCache Cache
        {
            get
            {
                if (cache == null)
                {
                    cache = new EntityDbCache(this);
                }
                return cache;
            }
        }

        //public EntityDb Contact { get { return this.DbEntities.Get("Contact", "Person.Contact", EntitySourceType.Table, EntityKeys.Get("ContactID"), EnableCache); } }

        #endregion


        #region Building
        
        public IEnumerable<BuildingView> GetBuildingView()
        {
            return base.EntityList<BuildingView>("vw_Buildings", null);
        }

        public IEnumerable<BuildingQueryView> GetBuildingQueryView(int ReportType,
            int AgentId,
            string Area,
            int AreaSizeMin,
            int AreaSizeMax,
            string Cities,
            int DealType,
            int PurposeType,
            bool ShowNewOnly
           )
        {
            return base.ExecuteList<BuildingQueryView>("sp_BuildingInfo_General","ReportType", ReportType, "AgentId", AgentId, "Area", Area, "AreaSizeMin", AreaSizeMin, "AreaSizeMax", AreaSizeMax, "Cities", Cities, "DealType", DealType, "PurposeType", PurposeType, "ShowNewOnly", ShowNewOnly);
        }

        public DataTable GetBuildingQueryTable(int ReportType,
            int AgentId,
            string Area,
            int AreaSizeMin,
            int AreaSizeMax,
            string Cities,
            int DealType,
            int PurposeType,
            bool ShowNewOnly
           )
        {
            using (IDbCmd cmd = NewCmd ())
            {
                return cmd.ExecuteCommand<DataTable>("sp_BuildingInfo_General", DataParameter.GetSql("ReportType", ReportType, "AgentId", AgentId, "Area", Area, "AreaSizeMin", AreaSizeMin, "AreaSizeMax", AreaSizeMax, "Cities", Cities, "DealType", DealType, "PurposeType", PurposeType, "ShowNewOnly", ShowNewOnly), System.Data.CommandType.StoredProcedure);
            }
        }

        #endregion
      
        #region Properties

        //public IEnumerable<PropertyView> GetPropertyView()
        //{
        //    return base.EntityItemList<PropertyView>("Properties", null);
        //}
        //public int SetPropertyView(PropertyView item)
        //{
        //    return base.SetEntity<PropertyView>("Properties", item);
        //}
        #endregion

        #region Crm
        
        #endregion

        #region Ads

        //public IEnumerable<AdsView> GetAdsView(int ReportType,
        //   int AgentId,
        //   string Area,
        //   int Status
        //  )
        //{
        //    return base.ExecuteQuery<AdsView>("sp_Ads_View","ReportType", ReportType, "AgentId", AgentId, "Area", Area, "Status", Status); 

        //    //return base.QueryToList<AdsView>("sp_Ads_View",
        //    //    DataParameter.GetSql("ReportType", ReportType, "AgentId", AgentId, "Area", Area, "Status", Status), System.Data.CommandType.StoredProcedure); 
        //}

        public IEnumerable<AdsView> GetAdsView()
        {
            return base.EntityList<AdsView>("Crm_Ads", null);
        }

        //public AdsView GetAdsView(int adsId)
        //{
        //    return base.EntityGet<AdsView>("Crm_Ads", DataFilter.GetSql("AdsId=@AdsId", adsId));
        //}

        #endregion

        #region Reports

        #endregion

        #region Admin

        //public IEnumerable<UsersView> GetUsersView()
        //{
        //    return base.EntityItemList<UsersView>("Crm_Users", null);
        //}
        //public UsersView GetUsersView(int userId)
        //{
        //    return base.EntityGet<UsersView>("Crm_Users", DataFilter.Get("UserId=@UserId",userId));
        //}

        #endregion
    }
    #endregion
}
