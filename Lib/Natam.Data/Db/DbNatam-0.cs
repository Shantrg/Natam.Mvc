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
using Natam.Data.Entities;

namespace Natam.Data.Db
{
   
    #region ResourceLang

    [Serializable]
    public class NatamCrmResources : EntityLang
    {
        public static CultureInfo GetCulture()
        {
            return new CultureInfo( "he-IL");
        }
        #region override

        protected override string CurrentCulture()
        {
            return GetCulture().Name;
        }

        protected override void LangBind()
        {
            //init by config key
            //base.Init(CurrentCulture(), "Natam.Data.Resources.Natam_Crm");
            //or
            base.Init("NatamData.Resources.NatamCrm");
            //or
            //base.Init(Nistec.Sys.NetResourceManager.GetResourceManager("Natam,Data.Resources.Natam_Crm", this.GetType()));
            //or
            //base.Init(Nistec.Sys.NetResourceManager.GetResourceManager( "Natam,Data.Resources.Natam_Crm",this.GetType()));
        }
        #endregion
    }
    #endregion

    #region DbContext

    [DbContext( "cnn_natam")]
    [Serializable]
    public partial class DbNatam : DbContext
    {
        #region static

        public const bool EnableCache = true;
        private static readonly DbNatam _instance = new DbNatam();

        public static DbNatam Instance
        {
            get { return _instance; }
        }

        public static string Cnn
        {
            get { return NetConfig.ConnectionString("Natam_Crm"); }
        }

        public DbNatam()
        {
        }

        #endregion

        #region override

        protected override void EntityBind()
        {
            //base.SetConnection("Natam_Crm", Cnn, DBProvider.SqlServer);
            //base.Items.SetEntity("Contact", "Person.Contact", EntitySourceType.Table, new EntityKeys("ContactID"));
            //base.SetEntity<ActiveContact>();
        }

        public override IEntityLang LangManager
        {
            get
            {
                return base.GetLangManager<NatamCrmResources>();
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

       
    }
    #endregion


}
