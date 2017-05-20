using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;

namespace Pro.Data.Entities
{

    [Entity(EntityName = "PurposeView", MappingName = "Crm_Purpose", ConnectionKey = "cnn_natam", EntityKey = new string[] { "PurposeId" })]
    public class PurposeContext : EntityContext<PurposeView>
    {
        #region ctor

        public PurposeContext()
        {
        }

        public PurposeContext(int PurposeId)
            : base(PurposeId)
        {
        }

        #endregion

        #region update

        public static int DoSave(int id, PurposeView bv, UpdateCommandType commandType)
        {
            if (commandType == UpdateCommandType.Delete)
                return EntityProp.PropertyRemove("purpose", id, 0);
                //using (PurposeContext context = new PurposeContext(id))
                //{
                //    return context.SaveChanges(commandType);
                //}

            EntityValidator.Validate(bv, "מטרת נכס", "he");

            if (commandType == UpdateCommandType.Insert)
                using (PurposeContext context = new PurposeContext())
                {
                    context.Set(bv);
                    return context.SaveChanges(commandType);
                }

            if (commandType == UpdateCommandType.Update)
                using (PurposeContext context = new PurposeContext(id))
                {
                    context.Set(bv);
                    return context.SaveChanges(commandType);
                }
            return 0;
        }

        public static int DoSave(int id, PurposeView bv)
        {
            EntityValidator.Validate(bv, "מטרת נכס", "he");
            
            using (PurposeContext context = new PurposeContext())
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

        #endregion

        #region static

        public static PurposeView Get(int id)
        {
            using (PurposeContext context = new PurposeContext(id))
            {
                return context.Entity;
            }
        }

        public static IEnumerable<PurposeView> View()
        {
            using (PurposeContext context = new PurposeContext())
            {
                return context.EntityList();
            }
        }
        #endregion

    }

    public class PurposeView : IEntityItem//EntityItem<DbNatam>, IEntityItem
    {

        #region override

        //public override string GetMappingName()
        //{
        //     return "Crm_Purpose"; 
        //}
        

        //public override EntityValidator Validate(UpdateCommandType commandType = UpdateCommandType.Update)
        //{
        //    EntityValidator validator = new EntityValidator("מטרת נכס", "he");
        //    validator.Required(PurposeName, "מטרת נכס");
        //    return validator;
        //}
        #endregion

        public static IEnumerable<PurposeView> View()
        {
            return DbNatam.Instance.EntityItemList<PurposeView>(TableName, null);
        }

        public static PurposeView View(int PurposeId)
        {
            return DbNatam.Instance.EntityItemGet<PurposeView>(TableName,"PurposeId", PurposeId);
        }

        //public int Update(PurposeView newItem, UpdateCommandType command)
        //{
        //    int res = DbNatam.Instance.SetEntity<PurposeView>(MappingName, this, newItem, command);
        //    return res;
        //}

        public const string TableName = "Crm_Purpose";

        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int PurposeId { get; set; }

        
        [Validator("מטרת נכס",true)]
        public string PurposeName { get; set; }

        #endregion

    }
 
}
