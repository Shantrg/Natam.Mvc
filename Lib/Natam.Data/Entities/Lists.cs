using Pro.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Pro.Data.Entities
{
    public enum ListsTypes
    {

        AgentList=1,
        AccountsList=2,
        AccountsOwners=3,
        AccountsTenants=4,
        AccountsManagements=5,
        AirConditionView=6,
        AreaZoneView=7,
        AreaTypes=8,
        DealTypes=9,
        ParkTypes=10,
        PurposeTypes=11,
        ZoneTypes=12,
        RequestSize=13,
        BuildingToActivate=14,
        ZoneQueryTypes=15,
        BuildingClass=16,
        Designation = 17,
        OwnerType = 18,
        AdsType=19,
        AdsStatus = 20,
        AdsPropertyType = 21
    }

    public class Lists
    {



        public static string GetList(ListsTypes type)
        {
            return DbNatam.Instance.ExecuteJson("sp_GetLists", "ListType", (int)type);
        }

        public static IList<T> GetList<T>(ListsTypes type)
        {
            return DbNatam.Instance.ExecuteList<T>("sp_GetLists", "ListType", (int)type);
        }
               
        public static string GetList_old(ListsTypes type)
        {
            switch (type)
            {
                case ListsTypes.AgentList: return AgentList();
                case ListsTypes.AccountsList: return AccountsList();
                case ListsTypes.AccountsOwners: return AccountsOwners();
                case ListsTypes.AccountsTenants: return AccountsTenants();
                case ListsTypes.AccountsManagements: return AccountsManagements();
                case ListsTypes.AirConditionView: return AirConditionView();
                case ListsTypes.AreaZoneView: return AreaZoneView();
                case ListsTypes.AreaTypes: return AreaTypes();
                case ListsTypes.DealTypes: return DealTypes();
                case ListsTypes.ParkTypes: return ParkTypes();
                case ListsTypes.PurposeTypes: return PurposeTypes();
                case ListsTypes.ZoneTypes: return ZoneTypes();
                case ListsTypes.RequestSize: return RequestSize();
                case ListsTypes.BuildingToActivate: return BuildingToActivate();
                default:
                    return null;
            }
        }

        public static string AgentList()
        {
            return DbNatam.Instance.QueryJson("vw_AgentList", null);
        }
        public static string AccountsList()
        {
            return DbNatam.Instance.QueryJson("vw_AccountsList", null);
        }
        public static string AccountsOwners()
        {
            return DbNatam.Instance.QueryJson("vw_AccountsList", "AccountType", 2);
        }
        public static string AccountsTenants()
        {
            return DbNatam.Instance.QueryJson("vw_AccountsList", "AccountType", 4);
        }
        public static string AccountsManagements()
        {
            return DbNatam.Instance.QueryJson("vw_AccountsList", "AccountType", 6);
        }

        public static string AirConditionView()
        {
            return DbNatam.Instance.QueryJson("Crm_AirCondition", null);
        }

        public static string AreaZoneView()
        {
            return DbNatam.Instance.QueryJson("vw_AreaZone", null);
        }
        public static string AreaTypes()
        {
            return DbNatam.Instance.QueryJson("Crm_Area", null);
        }
        public static string City()
        {
            return DbNatam.Instance.QueryJson("Dmg_Cities", null);
        }
        public static string CityByRegion(int Region)
        {
            return DbNatam.Instance.QueryJson("Dmg_Cities", "Region", Region);
        }

        public static string Streets()
        {
            return DbNatam.Instance.QueryJson("Dmg_Streets", null);
        }
        public static string StreetsByCity(int CityCode)
        {
            return DbNatam.Instance.QueryJson("Dmg_Streets", "CityCode", CityCode);
        }
        public static string StreetsByRegion(int Region)
        {
            return DbNatam.Instance.QueryJson("vw_Dmg_Streets", "Region", Region);
        }
        public static string DealTypes()
        {
            return DbNatam.Instance.QueryJson("Crm_Deal", null);
        }
         public static string ParkTypes()
         {
             return DbNatam.Instance.QueryJson("Crm_Park", null);
         }
         public static string PurposeTypes()
         {
             return DbNatam.Instance.QueryJson("Crm_Purpose", null);
         }
         public static string ZoneTypes()
         {
             return DbNatam.Instance.QueryJson("Crm_Zone", null);
         }
       
        public static string RequestSize()
        {
            return DbNatam.Instance.QueryJson("[Crm_RequestSize]", null);
        }


        public static string BuildingToActivate()
        {
            return DbNatam.Instance.QueryJson("vw_BuildingNoActiveView");
        }


        public static string BuildingByNatam(int BuildingId)
        {
            return DbNatam.Instance.ExecuteJson("sp_Query_Unit_Building", "QueryType", 4, "IdArg", BuildingId);
        }

        public static string BuildingByOwner(int OwnerId)
        {
            return DbNatam.Instance.ExecuteJson("sp_Query_Unit_Building", "QueryType", 3, "IdArg", OwnerId);
        }
        public static string UnitInfo(int BuildingId)
        {
            return DbNatam.Instance.QueryJson("vw_UnitInfo", "BuildingId", BuildingId);
        }

        public static string ContactsByAccount(int parentId, int role)
        {
            return DbNatam.Instance.QueryJson("Crm_Contacts", "ParentId", parentId, "Role", role);
        }

        public static string ContactsByRole(int role)
        {
            return DbNatam.Instance.QueryJson("Crm_Contacts", "Role", role);
        }

      

    }
}
