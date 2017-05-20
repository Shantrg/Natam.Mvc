using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;

namespace Pro.Data.Entities
{

    public class AccountNewsView : NewsView
    {

        public static IEnumerable<AccountNewsView> ViewByAccount(int AccountId)
        {
            return DbNatam.Instance.EntityItemList<AccountNewsView>("vw_Accounts_News", "AccountId", AccountId);
        }

        public static int UpdateNews(int AccountId, string NewsType)
        {
            return DbNatam.Instance.ExecuteNonQuery("sp_AccountNews_Update", "AccountId", AccountId, "NewsType", NewsType);
        }

        public static int DeleteNews(int AccountId, int NewsId)
        {
            return DbNatam.Instance.ExecuteCommand("delete from Crm_Accounts_News where AccountId=@AccountId and NewsId=@NewsId", System.Data.CommandType.Text, "AccountId", AccountId, "NewsId", NewsId);
        }

        
        public int AccountId { get; set; }

    }
  
    public class NewsView : EntityItem<DbNatam>, IEntityItem
    {
        #region override

        public override string MappingName()
        {
            return "Crm_News";
        }
 
        public override EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        {
            EntityValidator validator = new EntityValidator("קבוצות דיוור", "he");
            validator.Required(NewsName, "שם דייור");
            return validator;
        }
        #endregion

        
        public static IEnumerable<NewsView> View()
        {
            return DbNatam.Instance.EntityItemList<NewsView>(TableName, null);
        }
        public static NewsView View(int NewsId)
        {
            return DbNatam.Instance.EntityItemGet<NewsView>(TableName,"NewsId", NewsId);
        }

        public const string TableName = "Crm_News";


        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int NewsId { get; set; }
        
        [Validator("שם דיוור", true)]
        public string NewsName { get; set; }

        #endregion

        public static int DoSave(int id, NewsView view)
        {
      
            if (id > 0)
            {
                var entity = NewsView.View(id);
                return entity.DoUpdate<NewsView>(view);
            }
            else
                return view.DoInsert<NewsView>();
        }
        public static int DoDelete(int id)
        {
                return EntityProp.PropertyRemove("news", id, 0);
        }
    }

}
