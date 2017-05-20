using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;
using Nistec;

namespace Pro.Data.Entities
{

    [Entity(EntityName = "ContactView", MappingName = "Crm_Contacts", ConnectionKey = "cnn_natam", EntityKey = new string[] { "ContactId" })]
    public class ContactContext : EntityContext<ContactView>
    {
        #region ctor

        public ContactContext()
        {
        }

        public ContactContext(int ContactId)
            : base(ContactId)
        {
        }
        #endregion

        #region update

        public static int DoSave(int id, ContactView entity)
        {
            return DoSave(id, entity, id > 0 ? UpdateCommandType.Update : UpdateCommandType.Insert);
        }

        public static int DoDelete(int id)
        {
            using (ContactContext context = new ContactContext(id))
            {
                return context.SaveChanges(UpdateCommandType.Delete);
            }
        }

        public static int DoSave(int id, ContactView entity, UpdateCommandType commandType)
        {
            if (commandType == UpdateCommandType.Delete)
                using (ContactContext context = new ContactContext(id))
                {
                    return context.SaveChanges(commandType);
                }

            EntityValidator.Validate(entity, "איש קשר", "he");

            if (commandType == UpdateCommandType.Insert)
                using (ContactContext context = new ContactContext())
                {
                    context.Set(entity);
                    return context.SaveChanges(commandType);
                }

            if (commandType == UpdateCommandType.Update)
                using (ContactContext context = new ContactContext(id))
                {
                    context.Set(entity);
                    return context.SaveChanges(commandType);
                }
            return 0;
        }
        #endregion


        #region static

        public static ContactView Get(int id)
        {
            using (ContactContext context = new ContactContext(id))
            {
                return context.Entity;
            }
        }

        public static List<ContactView> GetItems(int parentId, int role)
        {
            using (ContactContext context = new ContactContext())
            {

                return context.EntityList(DataFilter.GetSql("ParentId=@ParentId and Role=@Role", parentId,role));
            }
        }

        #endregion
    }

    public class ContactInfoView : IEntityItem
    {
        public static IEnumerable<ContactInfoView> ListByParent(int parentId, int role)
        {
            return DbNatam.Instance.EntityItemList<ContactInfoView>(MappingName, "ParentId", parentId, "Role", role);
        }

        public static IEnumerable<ContactInfoView> ListByRole(int role)
        {
            return DbNatam.Instance.EntityItemList<ContactInfoView>(MappingName, "Role", role);
        }
        public static IEnumerable<ContactInfoView> ListByLead(int leadId)
        {
            return DbNatam.Instance.EntityItemList<ContactInfoView>(MappingName, "ParentId", leadId, "Role", 3);
        }
        public const string MappingName = "vw_Contacts_Info";


        [EntityProperty(EntityPropertyType.Identity)]
        public int ContactId { get; set; }

        public string Info { get; set; }

    }

    public class ContactListView : IEntityItem
    {
        public static IEnumerable<ContactListView> ListByAccount(int parentId, int role)
        {
            return DbNatam.Instance.EntityItemList<ContactListView>(MappingName, "ParentId", parentId, "Role", role);
        }

        public static IEnumerable<ContactListView> ListByRole(int role)
        {
            return DbNatam.Instance.EntityItemList<ContactListView>(MappingName, "Role", role);
        }

        public const string MappingName = "Crm_Contacts";


        [EntityProperty(EntityPropertyType.Identity)]
        public int ContactId { get; set; }
        
        public string ContactName { get; set; }
        
        public string Title { get; set; }
       
    }


    public class ContactView : IEntityItem
    {

        //public static IEnumerable<ContactView> ViewByAccount(int accountId)
        //{
        //    return DbNatam.Instance.EntityItemList<ContactView>(MappingName, "AccountId", accountId);
        //}
        public static IEnumerable<ContactView> ViewByParent(int parentId, int role, string uk)
        {
            if (parentId <= 0 && !Types.IsNull(uk))
                return DbNatam.Instance.EntityItemList<ContactView>(MappingName, "UploadKey", uk, "Role", role);

            return DbNatam.Instance.EntityItemList<ContactView>(MappingName, "ParentId", parentId, "Role", role);
        }
        public static IEnumerable<ContactView> View()
        {
            return DbNatam.Instance.EntityItemList<ContactView>(MappingName, null);
        }
        public static ContactView Get(int ContactId)
        {
            if (ContactId == 0)
                return new ContactView();
            return DbNatam.Instance.EntityItemGet<ContactView>(MappingName,"ContactId", ContactId);
        }
        public const string MappingName = "Crm_Contacts";

        [EntityProperty(EntityPropertyType.Identity)]
        public int ContactId { get; set; }
        [EntityProperty(Caption="שם")]
        public string ContactName { get; set; }
        public int ParentId { get; set; }
        [EntityProperty(Caption="תפקיד")]
        public string Title { get; set; }
        [EntityProperty(Caption = "דואל")]
        public string Email { get; set; }
        [EntityProperty(Caption = "טלפון נייד")]
        public string Mobile { get; set; }

        [EntityProperty(Caption = "טלפון 1")]
        public string Phone1 { get; set; }
        
        //public string ContactPhone2 { get; set; }
        //
        //public string ContactPhone3 { get; set; }
        
       
        public string Details { get; set; }
        public bool EnableNewsletter { get; set; }
        public bool IsNA { get; set; }
       // public int UserId { get; set; }
        
        //0=no role,1=BuildingContact
        public int Role { get; set; }

        [EntityProperty(EntityPropertyType.View)]
        public DateTime Creation { get; set; }

        public string UploadKey { get; set; }

        public string ToHtml()
        {
            return EntityProperties.ToHtmlTable<ContactView>(this,null, null, true);
        }

    }
}
