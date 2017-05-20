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
    [Entity(EntityName = "DealView", MappingName = "Crm_Deal", ConnectionKey = "cnn_natam", EntityKey = new string[] { "DealId" })]
    public class DealContext : EntityContext<DealView>
    {
        #region ctor

        public DealContext()
        {
        }

        public DealContext(int DealId)
            : base(DealId)
        {
        }

        #endregion

        #region update

        public static int DoSave(int id, DealView bv)
        {
            EntityValidator.Validate(bv, "סוג עסקה", "he");

            using (DealContext context = new DealContext())
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

        public static int DoSave(int id, DealView bv, UpdateCommandType commandType)
        {
            if (commandType == UpdateCommandType.Delete)
                return EntityProp.PropertyRemove("deal", id, 0);

                //using (DealContext context = new DealContext(id))
                //{
                //    return context.SaveChanges(commandType);
                //}

            EntityValidator.Validate(bv, "סוג עסקה", "he");

            if (commandType == UpdateCommandType.Insert)
                using (DealContext context = new DealContext())
                {
                    context.Set(bv);
                    return context.SaveChanges(commandType);
                }

            if (commandType == UpdateCommandType.Update)
                using (DealContext context = new DealContext(id))
                {
                    context.Set(bv);
                    return context.SaveChanges(commandType);
                }
            return 0;
        }

        public static int DoInsert(DealView bv)
        {
            EntityValidator.Validate(bv, "סוג עסקה", "he");

            using (DealContext context = new DealContext())
            {
                context.Set(bv);
                return context.SaveChanges(UpdateCommandType.Insert);
            }
        }

        public static int DoUpdate(int id, DealView bv)
        {
            EntityValidator.Validate(bv, "סוג עסקה", "he");

            using (DealContext context = new DealContext(id))
            {
                context.Set(bv);
                return context.SaveChanges(UpdateCommandType.Update);
            }
        }

        public static int DoDelete(int id)
        {
            using (DealContext context = new DealContext(id))
            {
                return context.SaveChanges(UpdateCommandType.Delete);
            }
        }

        #endregion

        #region static

        public static DealView Get(int id)
        {
            using (DealContext context = new DealContext(id))
            {
                return context.Entity;
            }
        }

        public static IEnumerable<DealView> View()
        {
            using (DealContext context = new DealContext())
            {
                return context.EntityList();
            }
        }
        #endregion

    }


    public class DealView : IEntityItem//EntityItem<DbNatam>, IEntityItem
    {
        #region override

        //public override string GetMappingName()
        //{
        //     return "Crm_Deal"; 
        //}

        //public override EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        //{
        //    EntityValidator validator = new EntityValidator("סוג עסקה", "he");
        //    validator.Required(DealName, "סוג עסקה");
        //    return validator;
        //}

        #endregion

        //public static IEnumerable<DealView> View()
        //{
        //    return DbNatam.Instance.EntityItemList<DealView>(TableName, null);
        //}
        //public static DealView View(int DealId)
        //{
        //    return DbNatam.Instance.EntityGet<DealView>(TableName, DealId);
        //}

        //public const string TableName = "Crm_Deal";

        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int DealId { get; set; }

        
        [Validator("סוג עסקה",true)]
        public string DealName { get; set; }

        #endregion

    }
 
}
