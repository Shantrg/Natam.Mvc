using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Nistec.Data;
//using Nistec.Channels.RemoteCache;
using Nistec.Web.Controls;
using Pro.Lib;

namespace Pro.Data.Entities
{
    
    public class AdContext<T> : EntityContext<DbNatam, T> where T : IEntityItem
    {
        public static void Refresh(int AccountId)
        {
            DbContextCache.Remove<T>(Settings.ProjectName, EntityCacheGroups.System, AccountId, 0);
        }
        public AdContext()
        {
            //no cache
        }
        public AdContext(int accountId,int userId=0)
        {
            if (accountId > 0)
                CacheKey = DbContextCache.GetKey<T>(Settings.ProjectName, EntityCacheGroups.System, accountId, userId);
        }
        public IList<T> ExecList(params object[] keyValueParameters)
        {
            return DbContextCache.ExecuteList<DbNatam, T>(CacheKey, keyValueParameters);
        }
        public IList<T> GetList()
        {
            return DbContextCache.EntityList<DbNatam, T>(CacheKey, null);
        }
        public IList<T> GetList(int accountId)
        {
            return DbContextCache.EntityList<DbNatam, T>(CacheKey, new object[] { "AccountId", accountId });
        }
        protected override void OnChanged(ProcedureType commandType)
        {
            DbContextCache.Remove(CacheKey);
        }
        public FormResult GetFormResult(EntityCommandResult res, string reason)
        {
            return FormResult.Get(res, this.EntityName, reason);
        }

    }
    public class AdContext 
    {
        public static int UpdateTeamLeader(int AccountId,int TeamId, int TeamLead)
        {
            using (var db = DbContext.Get<DbNatam>())
                return db.ExecuteCommand("update Ad_Team set TeamLead=@TeamLead where AccountId=@AccountId and TeamId=@TeamId", System.Data.CommandType.Text, "AccountId", AccountId, "TeamId", TeamId, "TeamLead", TeamLead);
            //return db.ExecuteCommandUpdate("Ad_Team", "TeamLead=@TeamLead", "AccountId=@AccountId and TeamId=@TeamId", "AccountId", AccountId, "TeamId", TeamId, "TeamLead", TeamLead);
        }
        public static int UpdateDepartmentLeader(int AccountId, int DepartmentId, int Manager)
        {
            using (var db = DbContext.Get<DbNatam>())
                return db.ExecuteCommand("update Ad_Department set Manager=@Manager where AccountId=@AccountId and DepartmentId=@DepartmentId", System.Data.CommandType.Text, "AccountId", AccountId, "DepartmentId", DepartmentId, "Manager", Manager);
            //return db.ExecuteCommandUpdate("Ad_Team", "TeamLead=@TeamLead", "AccountId=@AccountId and TeamId=@TeamId", "AccountId", AccountId, "TeamId", TeamId, "TeamLead", TeamLead);
        }
        public static string LookupAccountFolder(int AccountId)
        {
            using (var db = DbContext.Create<DbNatam>())
                return db.QueryScalar<string>("select Path from Ad_Account where AccountId=@AccountId", null, "AccountId", AccountId);
        }
        public static int LookupAccountFolder(string folder)
        {
            using (var db = DbContext.Create<DbNatam>())
                return db.QueryScalar<int>("select AccountId from Ad_Account where Path=@Path", 0, "Path", folder);
        }
    }

    [EntityMapping("Ad_Account", ProcDelete = null, ProcUpdate = null, ProcInsert = null)]
    public class AdAccount : IEntityItem
    {
        [EntityProperty(EntityPropertyType.Identity)]
        public int AccountId { get; set; }
        public int ParentId { get; set; }
        public string AccountName { get; set; }
        public string ContactName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string IdNumber { get; set; }
        public int Country { get; set; }
        public int OwnerId { get; set; }
        public int AccType { get; set; }
        public int AccountCategory { get; set; }
        public string Details { get; set; }
        public bool IsActive { get; set; }
         [EntityProperty(EntityPropertyType.View)]
        public DateTime CreationDate { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public DateTime? LastUpdate { get; set; }
        public string Path { get; set; }

    }

    #region AdGroup

    [EntityMapping("Ad_Group", "vw_Ad_Group", ProcDelete = null, ProcUpdate = null, ProcInsert = null)]
    public class AdGroupItem : IEntityItem
    {
        [EntityProperty(EntityPropertyType.Identity, Column = "GroupId")]
        public int GroupId { get; set; }

        [EntityProperty(Column = "GroupName")]
        [Validator("שם קבוצה", true)]
        public string GroupName { get; set; }
        [EntityProperty(EntityPropertyType.Key)]
        public int AccountId { get; set; }
       
        [EntityProperty(EntityPropertyType.View)]
        public DateTime Creation { get; set; }
        [EntityProperty(EntityPropertyType.Optional)]
        public int MembersCount { get; set; }
    }

    //[EntityMapping("vw_Ad")]
    //public class AdItemView : AdItem
    //{
    //   public int MembersCount { get; set; }
    //}

    [EntityMapping("Ad_Group_Rel", "vw_Ad_Group_Rel", ProcUpdate="sp_Ad_Group_Rel_Update")]
    public class AdGroupItemRel:IEntityItem
    {
        [EntityProperty(EntityPropertyType.Key)]
        public int GroupId { get; set; }
        [EntityProperty(EntityPropertyType.Key)]
        public int UserId { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public DateTime Creation { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string DisplayName { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string ProfessionName { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string Email { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string Phone { get; set; }
        public int AccountId { get; set; }
    }

    [EntityMapping(ProcListView = "sp_Ad_Group_Rel")]
    public class AdGroupItemRelAll : AdGroupItemRel
    {

    }
    #endregion

    #region AdDepartment

    [EntityMapping("Ad_Department", "vw_Ad_Department", ProcDelete = null, ProcUpdate = null, ProcInsert = null)]
    public class AdDepartmentItem : IEntityItem
    {
        [EntityProperty(EntityPropertyType.Identity, Column = "DepartmentId")]
        public int DepartmentId { get; set; }

        [EntityProperty(Column = "DepartmentName")]
        [Validator("שם מחלקה", true)]
        public string DepartmentName { get; set; }
        [EntityProperty(EntityPropertyType.Key)]
        public int AccountId { get; set; }
        public int Manager { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string ManagerDisplayName { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public DateTime Creation { get; set; }
        [EntityProperty(EntityPropertyType.Optional)]
        public int MembersCount { get; set; }
    }

    //[EntityMapping("vw_Ad")]
    //public class AdItemView : AdItem
    //{
    //   public int MembersCount { get; set; }
    //}

    [EntityMapping("Ad_Department_Rel", "vw_Ad_Department_Rel", ProcUpdate = "sp_Ad_Department_Rel_Update")]
    public class AdDepartmentItemRel : IEntityItem
    {
        [EntityProperty(EntityPropertyType.Key)]
        public int DepartmentId { get; set; }
        [EntityProperty(EntityPropertyType.Key)]
        public int TeamId { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public DateTime Creation { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string TeamName { get; set; }
        public int AccountId { get; set; }
    }

    [EntityMapping(ProcListView = "sp_Ad_Department_Rel")]
    public class AdDepartmentItemRelAll : AdDepartmentItemRel
    {

    }

    [EntityMapping(ProcListView = "sp_Ad_Department_Rel")]
    public class AdDepartmentUsersRel : AdTeamItemRel
    {

    }

    [EntityMapping("Ad_Team_Rel", "vw_Ad_Team_Rel")]
    public class AdDepartmentUserItemRel : IEntityItem
    {

        [EntityProperty(EntityPropertyType.Key)]
        public int TeamId { get; set; }
        [EntityProperty(EntityPropertyType.Key)]
        public int UserId { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public DateTime Creation { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string DisplayName { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string ProfessionName { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string Email { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string Phone { get; set; }
        public int AccountId { get; set; }
    }
    
    #endregion

    #region AdTeam

    [EntityMapping("Ad_Team", "vw_Ad_Team", ProcDelete = null, ProcUpdate = null, ProcInsert = null)]
    public class AdTeamItem : IEntityItem
    {
        [EntityProperty(EntityPropertyType.Identity, Column = "TeamId")]
        public int TeamId { get; set; }

        [EntityProperty(Column = "TeamName")]
        [Validator("שם קבוצה", true)]
        public string TeamName { get; set; }
        [EntityProperty(EntityPropertyType.Key)]
        public int AccountId { get; set; }

        public int TeamLead { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string LeadDisplayName { get; set; }

        [EntityProperty(EntityPropertyType.View)]
        public DateTime Creation { get; set; }

        [EntityProperty(EntityPropertyType.Optional)]
        public int MembersCount { get; set; }
    }
    //[EntityMapping("vw_Ad_Team")]
    //public class AdTeamItemView : AdTeamItem
    //{
    //    public int MembersCount { get; set; }
    //}
     [EntityMapping("Ad_Team_Rel", "vw_Ad_Team_Rel", ProcUpdate = "sp_Ad_Team_Rel_Update")]
    public class AdTeamItemRel : IEntityItem
    {
 
        [EntityProperty(EntityPropertyType.Key)]
        public int TeamId { get; set; }
        [EntityProperty(EntityPropertyType.Key)]
        public int UserId { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public DateTime Creation { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string DisplayName { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string ProfessionName { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string Email { get; set; }
        [EntityProperty(EntityPropertyType.View)]
        public string Phone { get; set; }
        public int AccountId { get; set; }
    }
     [EntityMapping(ProcListView = "sp_Ad_Team_Rel")]
     public class AdTeamItemRelAll : AdTeamItemRel
     {

     }
    #endregion

    #region AdUserProfile


     [EntityMapping("Ad_UserProfile", "vw_Ad_UserProfile", ProcDelete = "sp_Ad_UserDelete", ProcUpdate = null, ProcInsert = "sp_Ad_UserRegister", ProcListView = "sp_Ad_GetUsers")]
     public class AdUserProfile : IEntityItem
     {

         [EntityProperty(EntityPropertyType.Identity)]
         public int UserId
         {
             get;
             set;
         }
         public string UserName
         {
             get;
             set;
         }
         public string DisplayName
         {
             get;
             set;
         }
         [EntityProperty(EntityPropertyType.View)]
         public DateTime Creation
         {
             get;
             set;
         }
         public string Phone
         {
             get;
             set;
         }
         public string Email
         {
             get;
             set;
         }

         public int UserRole
         {
             get;
             set;
         }
         public int AccountId
         {
             get;
             set;
         }
         public string Lang
         {
             get;
             set;
         }
         public int Evaluation
         {
             get;
             set;
         }
         public bool IsBlocked
         {
             get;
             set;
         }
         [EntityProperty(EntityPropertyType.View)]
         public string RoleName
         {
             get;
             set;
         }
         [EntityProperty(EntityPropertyType.View)]
         public string AccountName
         {
             get;
             set;
         }
         [EntityProperty(EntityPropertyType.View)]
         public string AccountCategory  
         {
             get;
             set;
         }
         //[EntityProperty(EntityPropertyType.View)]
         //public bool IsResetPass
         //{
         //    get;
         //    set;
         //}
     }

    
     #endregion

    #region AdShare

    //sp_Ad_Share_UserList @ShareModel tinyint,@AccountId int,@UserId int

     [EntityMapping("Ad_Share", ProcDelete = "sp_Ad_Share_UserDelete", ProcUpdate = null, ProcInsert = "sp_Ad_Share_UserRegister", ProcListView = "sp_Ad_Share_UserList")]
     public class AdShare : IEntityItem
     {

         [EntityProperty(EntityPropertyType.Key)]
         public int ShareModel
         {
             get;
             set;
         }
           [EntityProperty(EntityPropertyType.Key)]
         public int UserId
         {
             get;
             set;
         }

           [EntityProperty(EntityPropertyType.Key)]
         public int ShareWith
         {
             get;
             set;
         }
         public bool AllowEdit
         {
             get;
             set;
         }
         [EntityProperty(EntityPropertyType.Optional)]
         public string DisplayName
         {
             get;
             set;
         }
         [EntityProperty(EntityPropertyType.Optional)]
         public string ShareUser
         {
             get;
             set;
         }
     }
    #endregion

}
