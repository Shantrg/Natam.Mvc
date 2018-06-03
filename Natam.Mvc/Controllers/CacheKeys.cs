using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Natam.Mvc.Controllers
{
    public static class CacheKeys
    {
        
        internal static string GetFloorGrid(int BuildingId) { return string.Format("GetFloorGrid_{0}", BuildingId); }
        internal static string GetQueryBuildingGrid(int QueryType, string Area, int DealType, int PurposeType, int AreaSizeMin, int AreaSizeMax, string BuildingName, string BuildingStreet, string StreetNo, string City, int OwnerId, int BuildingId)
        {
            return string.Format("GetQueryBuildingGrid_{0}_{1}_{2}_{3}_{4}_{5}_{6}_{7}_{8}_{9}_{10}_{11}", QueryType, Area, DealType, PurposeType, AreaSizeMin, AreaSizeMax, BuildingName, BuildingStreet, StreetNo, City, OwnerId, BuildingId);
        }
        internal static string GetPropertyGrid(int PropertyType, int ParentId, int AgentId, string DealType, string PurposeType, string AreaType, string RequestSize)
        {
            return string.Format("GetQueryPropertyGrid_{0}_{1}_{2}_{3}_{4}_{5}_{6}", PropertyType, ParentId, AgentId, DealType, PurposeType, AreaType, RequestSize);
        }
        internal static string GetUnitGrid(int BuildingId, int FloorNum, int PropertyType)
        {
            return string.Format("GetUnitGrid_{0}_{1}_{2}", BuildingId, FloorNum, PropertyType);
        }
        internal static string GetLeadProperty(int LeadId)
        {
            return string.Format("GetLeadProperty_{0}", LeadId);
        }
        internal static string GetPropertyList(int PropertyType, int ParentId)
        {
            return string.Format("GetPropertyList{0}_{1}", PropertyType, ParentId);
        }
        internal static string GetContactView(int accountId) { return string.Format("GetContactView_{0}", accountId); }
        internal static string GetContactByRole(int role) { return string.Format("GetContactByRole_{0}", role); }
        internal static string GetLeadsView(int userId) { return string.Format("GetLeadsView_{0}", userId); }
        internal static string GetTraceView(int userId) { return string.Format("GetTraceView_{0}", userId); }
        //internal static string GetLeadPropertyList(int LeadId) { return string.Format("GetLeadPropertyList_{0}", LeadId); }
        internal static string GetTransList(int AgentId) { return string.Format("GetTransList_{0}", AgentId); }
        internal static string GetAdminTransList(int AgentId) { return string.Format("GetAdminTransList_{0}", AgentId); }
        internal static string GetAdsView(int userId, int state) { return string.Format("GetAdsView_{0}_{1}", userId, state); }

        internal const string GetPlotsGrid = "GetPlotsGrid";
        internal const string GetPurposeView= "GetPurposeView";
        internal const string GetZoneView = "GetZoneView";
        internal const string GetAreaViewAll = "GetAreaViewAll";
        internal const string GetAirConditionView = "GetAirConditionView";
        internal const string GetParkingTypeView = "GetParkingTypeView";
        internal const string GetInvestmentGrid = "GetInvestmentGrid";
        internal const string GetDealView = "GetDealView";
        internal const string GetBuildingToActivateGrid = "GetBuildingToActivateGrid";
        internal const string GetNewsView = "GetNewsView";
        internal const string GetCategoryView = "GetCategoryView";
        internal const string GetBuildingClass = "GetBuildingClass";
        internal const string GetDesignation = "GetDesignation";
        internal const string GetOwnerType = "GetOwnerType";
        internal const string GetAdsType = "GetAdsType";
        internal const string GetAdsStatus = "GetAdsStatus";
        internal const string GetAdsPropertyType = "GetAdsPropertyType";

        internal const string GetManagementView = "GetManagementView";
        internal const string GetTenantView = "GetTenantView";
        internal const string GetCustomerView = "GetCustomerView";
        internal const string GetOwnerView = "GetOwnerView";
        internal const string GetRequestSize = "GetRequestSize";
        internal const string GetAgentList = "GetAgentList";
        //internal const string GetLeadsView = "GetLeadsView";
        internal const string GetCityListView = "GetCityListView";
        internal const string GetStreetsListView = "GetStreetsListView";
    }
}