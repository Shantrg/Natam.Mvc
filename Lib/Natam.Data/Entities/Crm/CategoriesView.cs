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
  
    public class CategoryView : EntityItem<DbNatam>, IEntityItem
    {
        #region override

        public override string MappingName()
        {
            return "Crm_Categories";
        }
 
        public override EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        {
            EntityValidator validator = new EntityValidator("קטגוריות", "he");
            validator.Required(CategoryName, "שם קטגוריה");
            return validator;
        }
        #endregion

        public static CategoryView ViewByAccount(int AccountId)
        {
            return DbNatam.Instance.EntityItemGet<CategoryView>("vw_Accounts_Category", "AccountId", AccountId);
        }
        public static IEnumerable<CategoryView> View()
        {
            return DbNatam.Instance.EntityItemList<CategoryView>(TableName, null);
        }
        public static CategoryView View(int CategoryId)
        {
            //return DbNatam.Instance.EntityGet<CategoryView>(TableName, 
            return DbNatam.Instance.EntityItemGet<CategoryView>("vw_Accounts_Category", "CategoryId", CategoryId);
        }

        public const string TableName = "Crm_Categories";


        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int CategoryId { get; set; }
        
        [Validator("שם קטגוריה", true)]
        public string CategoryName { get; set; }

        #endregion

        public static int DoSave(int id, CategoryView view)
        {
            if (id > 0)
            {
                var entity = CategoryView.View(id);
                return entity.DoUpdate<CategoryView>(view);
            }
            else
                return view.DoInsert<CategoryView>();
        }
    }

}
