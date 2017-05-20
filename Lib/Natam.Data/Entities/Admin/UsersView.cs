using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;

namespace Natam.Data.Entities
{


    public class UsersView : IEntityItem
    {
        const string TableName = "Crm_Users";

        public static IEnumerable<UsersView> GetUsersView()
        {
            return DbNatam.Instance.EntityGetList<UsersView>(TableName, null);
        }
        public static UsersView GetUsersView(int userId)
        {
            return DbNatam.Instance.EntityGet<UsersView>(TableName, userId);
        }

        public static string LookupUserName(int userId)
        {
            if (userId <= 0)
                return "";
            return DbNatam.Instance.QueryScalar<string>("select UserName from " + TableName + " where UserId=@UserId", "", "UserId", userId);
        }

        #region properties

        [EntityProperty(EntityPropertyType.Identity)]
        public int UserId
        {
            get;
            set;
        }
        [EntityProperty(EntityPropertyType.Default)]
        public string UserName
        {
            get;
            set;
        }
 
        [EntityProperty(EntityPropertyType.Default)]
        public DateTime Creation
        {
            get;
            set;
        }
   
 
        [EntityProperty(EntityPropertyType.Default)]
        public string Cell
        {
            get;
            set;
        }

        [EntityProperty(EntityPropertyType.Default)]
        public string Phone
        {
            get;
            set;
        }
        [EntityProperty(EntityPropertyType.Default)]
        public string Fax
        {
            get;
            set;
        }
        [EntityProperty(EntityPropertyType.Default)]
        public string Email
        {
            get;
            set;
        }

        [EntityProperty(EntityPropertyType.Default)]
        public string LoginName
         {
             get;
             set;
         }
 
        [EntityProperty(EntityPropertyType.Default)]
        public string Pass
        {
            get {return "****";}
            set { ;}
        }
        [EntityProperty(EntityPropertyType.Default)]
        public string Autorization
        {
            get;
            set;
        }
 

       #endregion

      
    }
 
}
