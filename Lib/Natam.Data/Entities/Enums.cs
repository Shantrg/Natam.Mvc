using Nistec.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Pro.Data.Entities
{
    public enum AccountTypes
    {
        //TypeId	TypeName
        Unknown = 0,    //0	לא ידוע
        Customer = 1,   //1	לקוח
        Owner = 2,   //2	בעלים
        Investor = 3,   //3	משקיע
        Tenant = 4,   //4	דייר
        Profession = 5,   //5	בעל מקצוע
        Management = 6,  //6	חברת ניהול
        Lead = 7//לקוח סןכן
    }

    public enum ContactRole
    {
        AccountContact=0,
        BuildingContact=1,
        //OwnerContact=2,
        //ManagementContact=3,
        //CustomerContact=4,
        LeadContact=3,
        AgentContact=4
    }

    public enum PropertyTypes
    {
        Unit = 0,
        Property = 1,
        Lead = 2
    }

    public enum TransTypes
    {
        Buyer = 1,
        Seller = 2,
        Advice=3
    }

    public enum TransStatus
    {
        TransOk = 1,
        //Seller = 2,
        Cancel = 3
    }
    public enum BuildingState
    {
        NotActive=0,
        Active=1,
        Archive=5
    }

    public enum AdsViewType { ViewByProperty = 1, ViewByAgent = 2, ViewAll = 3, ViewByAds = 4 }
    public enum AdsStatus { Wait = 0, Active = 1, Expired = 2}
    public enum AdsStateView { Wait = 0, Active = 1, Expired = 2 , WaitAndActive=100, All=255}

    public class BuildingClasses : IEntityItem
    {
        public string ClassType { get; set; }
        public string ClassName { get; set; }
    }

}
