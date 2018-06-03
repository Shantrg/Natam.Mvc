using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nistec.Data.Entities;
using Pro.Data;
using Nistec.Data;
using Nistec;
using Nistec.Serialization;
using Nistec.Web;
using System.Data;
using Pro.Data.Entities;

namespace Pro.Data.Entities
{

    [Entity(EntityName = "TransactionView", MappingName = "Crm_Transaction", ConnectionKey = "cnn_natam", EntityKey = new string[] { "TransId" })]
    public class TransactionContext : EntityContext<TransactionView>
    {
        #region ctor

        public TransactionContext()
        {
        }

        public TransactionContext(int TransId)
            : base(TransId)
        {
        }
        #endregion

        #region update

        public static int DoSave(int id, TransactionView entity)
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

        public static int DoSave(int id, TransactionView entity, UpdateCommandType commandType)
        {
            if (commandType == UpdateCommandType.Delete)
                using (ContactContext context = new ContactContext(id))
                {
                    return context.SaveChanges(commandType);
                }

            EntityValidator.Validate(entity, "סיכום עסקה", "he");

            if (commandType == UpdateCommandType.Insert)
                using (TransactionContext context = new TransactionContext())
                {
                    context.Set(entity);
                    return context.SaveChanges(commandType);
                }

            if (commandType == UpdateCommandType.Update)
                using (TransactionContext context = new TransactionContext(id))
                {
                    context.Set(entity);
                    return context.SaveChanges(commandType);
                }
            return 0;
        }

        public static int DoSave(TransactionView v)
        {

            EntityValidator.Validate(v, "דוח עסקה", "he");
            
            v.Trans_Status = 1;

            var args = new object[]{
            "TransId",v.TransId
            ,"Trans_Status",v.Trans_Status
            ,"TransType",v.TransType
            ,"Creation",v.Creation
            ,"InvoiceNo",v.InvoiceNo
            ,"Client_Id",v.Client_Id
            ,"Client_Name",v.Client_Name
            ,"Client_Address",v.Client_Address
            ,"Client_City",v.Client_City
            ,"Client_Phone",v.Client_Phone
            ,"Client_Fax",v.Client_Fax
            ,"Client_Email",v.Client_Email
            ,"Client_ContactId",v.Client_ContactId
            ,"Client_ContactName",v.Client_ContactName
            ,"Client_ContactTitle",v.Client_ContactTitle
            ,"PropertyId",v.PropertyId
            ,"Property_Type",v.Property_Type
            ,"Property_Address",v.Property_Address
            ,"Property_City",v.Property_City
            ,"Property_Floor",v.Property_Floor
            ,"Property_Size",v.Property_Size
            ,"Property_Comment",v.Property_Comment
            ,"Property_LastUpdate",v.Property_LastUpdate
            ,"IsNatam",v.IsNatam
            ,"BuildingName",v.BuildingName
            ,"Seller_Id",v.Seller_Id
            ,"Seller_Name",v.Seller_Name
            ,"Seller_Address",v.Seller_Address
            ,"Seller_City",v.Seller_City
            ,"Seller_Phone",v.Seller_Phone
            ,"Seller_Fax",v.Seller_Fax
            ,"Seller_Email",v.Seller_Email
            ,"Seller_ContactId",v.Seller_ContactId
            ,"Seller_ContactName",v.Seller_ContactName
            ,"Seller_ContactTitle",v.Seller_ContactTitle            
            ,"Dealer_Type",v.Dealer_Type
            ,"Value_Rent_Size",v.Value_Rent_Size
            ,"Value_Rent_Price",v.Value_Rent_Price
            ,"Value_Rent_Period",v.Value_Rent_Period
            ,"Value_Rent_Total",v.Value_Rent_Total
            ,"Value_Rent_Park_No",v.Value_Rent_Park_No
            ,"Value_Rent_Park_Price",v.Value_Rent_Park_Price
            ,"Value_Rent_Park_Period",v.Value_Rent_Park_Period
            ,"Value_Rent_Park_Total",v.Value_Rent_Park_Total
            ,"Value_Sale_Size",v.Value_Sale_Size
            ,"Value_Sale_Price",v.Value_Sale_Price
            //,"Value_Sale_Period",v.Value_Sale_Period
            ,"Value_Sale_Total",v.Value_Sale_Total
            ,"Value_Sale_Park_No",v.Value_Sale_Park_No
            ,"Value_Sale_Park_Price",v.Value_Sale_Park_Price
            //,"Value_Sale_Park_Period",v.Value_Sale_Park_Period
            ,"Value_Sale_Park_Total",v.Value_Sale_Park_Total
            ,"ContractDate",v.ContractDate
            ,"DateEndContract",v.DateEndContract
            ,"DateEndOption1",v.DateEndOption1
            ,"DateEndOption2",v.DateEndOption2
            ,"ComissionNet",v.ComissionNet
            ,"AgentId",v.AgentId
            ,"Comment",v.Comment
            ,"TotalValue",v.TotalValue
            ,"Payment_Ex_Item",v.Payment_Ex_Item
            ,"Payment_Ex_Percent",v.Payment_Ex_Percent
            ,"Payment_Ex_Net",v.Payment_Ex_Net
            ,"Payment_In_Item_1",v.Payment_In_Item_1
            ,"Payment_In_Percent_1",v.Payment_In_Percent_1
            ,"Payment_In_Net_1",v.Payment_In_Net_1
            ,"Payment_In_Item_2",v.Payment_In_Item_2
            ,"Payment_In_Percent_2",v.Payment_In_Percent_2
            ,"Payment_In_Net_2",v.Payment_In_Net_2
            ,"Payment_In_Item_3",v.Payment_In_Item_3
            ,"Payment_In_Percent_3",v.Payment_In_Percent_3
            ,"Payment_In_Net_3",v.Payment_In_Net_3
            ,"Payment_In_Item_4",v.Payment_In_Item_4
            ,"Payment_In_Percent_4",v.Payment_In_Percent_4
            ,"Payment_In_Net_4",v.Payment_In_Net_4
            };
            var parameters = DataParameter.GetSql(args);
            parameters[0].Direction = System.Data.ParameterDirection.InputOutput;
            int res = DbNatam.Instance.ExecuteCommandNonQuery("sp_Transaction_Save", parameters, System.Data.CommandType.StoredProcedure);
            v.TransId = Types.ToInt(parameters[0].Value);
            return v.TransId;
        }

        public static int DoCancel(int TransId,int UserId)
        {
            var parameters = DataParameter.GetSql("TransId", TransId, "UserId", UserId);
            return DbNatam.Instance.ExecuteCommandNonQuery("sp_Transaction_Cancel", parameters, System.Data.CommandType.StoredProcedure);
        }

        #endregion

        #region static
        public static IEnumerable<TransactionPayement> TransactionPayementsView(int TransId)
        {
            return DbNatam.Instance.EntityItemList<TransactionPayement>("Crm_Transaction_Payment", "TransId", TransId);
        }
        public static TransactionView View(int TransId)
        {
            return DbNatam.Instance.EntityItemGet<TransactionView>("Crm_Transaction", "TransId", TransId);
        }

        public static IEnumerable<TransactionItem> ViewList(int AgentId)
        {
            return DbNatam.Instance.EntityItemList<TransactionItem>("Crm_Transaction", "AgentId", AgentId);
        }

        public static IEnumerable<TransactionItem> ViewAdminList()
        {
            return DbNatam.Instance.EntityItemList<TransactionItem>("Crm_Transaction");
        }

        public static TransactionView FillBuyerTransaction(int LeadId, int UnitId, int ContactId, int AgentId)
        {
            LeadsView lead = LeadsContext.View(LeadId);
            UnitBuildingInfoView unit = UnitBuildingInfoView.ViewUnitBuildingInfo(UnitId);
            ContactView c = ContactContext.Get(ContactId);
            string SellerName = AccountContext.LookupAccountName(unit.OwnerId);

            TransactionView v = new TransactionView()
            {
                TransType = (int)TransTypes.Buyer,
                AgentId = AgentId,
                Client_Address = lead.Address,
                Client_City = lead.City,
                Client_Name = lead.CustomerName,
                Client_Id = lead.LeadId,
                Client_Fax = lead.Fax,
                Client_Phone = lead.Phone,

                Client_Email = c.Email,
                Client_ContactId = ContactId,
                Client_ContactTitle=c.Title,
                Client_ContactName=c.ContactName,
                

                BuildingName = unit.BuildingName,
                Property_Type = unit.PurposeId,
                Property_Address = unit.Address,
                Property_City=unit.CityName,
                Property_Comment = "",
                Property_Floor = unit.FloorNum,
                Property_Size = unit.UnitSize,
                PropertyId = unit.UnitId,
                Property_LastUpdate=unit.LastUpdate,
                DateEndContract = unit.DateEndContract,
                DateEndOption1 = unit.DateEndOption1,
                DateEndOption2 = unit.DateEndOption2,

                Dealer_Type=(int)AccountTypes.Owner,
                Seller_Id=unit.OwnerId,
                Seller_Name = SellerName
                 
            };
            return v;
        }

        public static TransactionView FillSellerTransaction(int ClientId, int UnitId, int SellerContactId, int AgentId)
        {
            string ClientName = null;
            if (ClientId > 0)
            {
                LeadsView lead = LeadsContext.View(ClientId);
                ClientName = lead.CustomerName;
            }
            if (ClientId < 0)
            {
                ClientName = "לקוח לא ידוע";
            }

            UnitBuildingInfoView unit = UnitBuildingInfoView.ViewUnitBuildingInfo(UnitId);
            ContactView c = ContactContext.Get(SellerContactId);
            AccountView seller = AccountContext.Get(unit.OwnerId);

            string SellerName = AccountContext.LookupAccountName(unit.OwnerId);

            TransactionView v = new TransactionView()
            {
                TransType = (int)TransTypes.Seller,
                AgentId = AgentId,
                Client_Id = ClientId,
                Client_Name = ClientName,
                //Client_Address = lead.Address,
                //Client_City = lead.City,
                //Client_Fax = lead.Fax,
                //Client_Phone = lead.Phone,

                //Client_Email = c.Email,
                //Client_ContactId = ContactId,
                //Client_ContactTitle = c.Title,
                //Client_ContactName = c.ContactName,


                BuildingName = unit.BuildingName,
                Property_Type = unit.PurposeId,
                Property_Address = unit.Address,
                Property_City = unit.CityName,
                Property_Comment = "",
                Property_Floor = unit.FloorNum,
                Property_Size = unit.UnitSize,
                PropertyId = unit.UnitId,
                Property_LastUpdate = unit.LastUpdate,

                DateEndContract = unit.DateEndContract,
                DateEndOption1 = unit.DateEndOption1,
                DateEndOption2 = unit.DateEndOption2,

                Dealer_Type = (int)AccountTypes.Owner,
                Seller_Id = unit.OwnerId,
                Seller_Name = seller.AccountName,
                Seller_Address = seller.Address,
                Seller_City = seller.City,
                Seller_Fax = seller.Fax,
                Seller_Phone = seller.Phone1,

                Seller_Email = c.Email,
                Seller_ContactId = SellerContactId,
                Seller_ContactTitle = c.Title,
                Seller_ContactName = c.ContactName,

            };
            return v;
        }

        public static TransactionView FillAdviceTransaction(int LeadId, int UnitId, int ContactId, int AgentId)
        {
            LeadsView lead = LeadsContext.View(LeadId);
            ContactView c = ContactContext.Get(ContactId);
           
            TransactionView v = new TransactionView()
            {
                Creation=DateTime.Now,
                TransType=(int)TransTypes.Advice,
                AgentId = AgentId,
                Client_Address = lead.Address,
                Client_City = lead.City,
                Client_Name = lead.CustomerName,
                Client_Id = lead.LeadId,
                Client_Fax = lead.Fax,
                Client_Phone = lead.Phone,

                Client_Email = c.Email,
                Client_ContactId = ContactId,
                Client_ContactTitle = c.Title,
                Client_ContactName = c.ContactName,
              
                Property_Comment = "",
                Dealer_Type = (int)AccountTypes.Owner,

            };
            if (UnitId > 0)
            {
                UnitBuildingInfoView unit = UnitBuildingInfoView.ViewUnitBuildingInfo(UnitId);
                string SellerName = AccountContext.LookupAccountName(unit.OwnerId);

                v.BuildingName = unit.BuildingName;
                v.Property_Type = unit.PurposeId;
                v.Property_Address = unit.Address;
                v.Property_City = unit.CityName;
                v.Property_Floor = unit.FloorNum;
                v.Property_Size = unit.UnitSize;
                v.PropertyId = unit.UnitId;
                v.Property_LastUpdate = unit.LastUpdate;
                v.DateEndContract = unit.DateEndContract;
                v.DateEndOption1 = unit.DateEndOption1;
                v.DateEndOption2 = unit.DateEndOption2;
                v.Seller_Id = unit.OwnerId;
                v.Seller_Name = SellerName;

            }

            return v;
        }

        #endregion
    }


    public class TransactionItem : IEntityItem
    {

        [EntityProperty(EntityPropertyType.Identity)]
        public int TransId { get; set; }
        public int TransType { get; set; }
        public DateTime Creation { get; set; }
        public DateTime? Property_LastUpdate { get; set; }
        public DateTime? ContractDate { get; set; }
        public string InvoiceNo { get; set; }
        public int Client_Id { get; set; }
        public string Client_Name { get; set; }
        public int PropertyId { get; set; }
        public int Property_Type { get; set; }
        public string Property_Address { get; set; }
        public string Property_City { get; set; }
        public int Property_Floor { get; set; }
        public float Property_Size { get; set; }
        public string BuildingName { get; set; }
        public int Seller_Id { get; set; }
        public string Seller_Name { get; set; }
        public int AgentId { get; set; }

        //public string TransTypeName
        //{
        //    get
        //    {
        //        switch ((TransTypes)TransType)
        //        {
        //            case TransTypes.Advice:
        //                return "עסקת ייעוץ";
        //            case TransTypes.Buyer:
        //                return "עסקה מצד הדייר/רוכש";
        //            case TransTypes.Seller:
        //                return "עסקה מצד בעל הנכס/מוכר";
        //            default:
        //                return "עסקה";

        //        }
        //    }

        //}

        public int Trans_Status { get; set; }

        public string TransTypeName
        {
            get
            {
                switch ((TransTypes)TransType)
                {
                    case TransTypes.Advice:
                        return "עסקת ייעוץ" + (Trans_Status==3?"-מבוטל":"");
                    case TransTypes.Buyer:
                        return "הדייר/רוכש" + (Trans_Status == 3 ? "-מבוטל" : "");
                    case TransTypes.Seller:
                        return "בעל הנכס/מוכר" + (Trans_Status == 3 ? "-מבוטל" : "");
                    default:
                        return "עסקה" + (Trans_Status == 3 ? "-מבוטל" : "");

                }
            }

        }
    }
    public class TransactionView : IEntityItem
    {
       
        [EntityProperty(EntityPropertyType.Identity)]
        public int TransId { get; set; }
        public int TransType { get; set; }
        public DateTime Creation { get; set; }
        public DateTime? Property_LastUpdate { get; set; }
        public string InvoiceNo { get; set; }
        public int Client_Id { get; set; }
        public string Client_Name { get; set; }
        public string Client_Address { get; set; }
        public string Client_City { get; set; }
        public string Client_Phone { get; set; }
        public string Client_Fax { get; set; }
        public string Client_Email { get; set; }
        public int Client_ContactId { get; set; }
        public string Client_ContactName { get; set; }
        public string Client_ContactTitle { get; set; }
        public int PropertyId { get; set; }
        public int Property_Type { get; set; }
        public string Property_Address { get; set; }
        public string Property_City { get; set; }
        public int Property_Floor { get; set; }
        public float Property_Size { get; set; }
        public string Property_Comment { get; set; }
        public bool IsNatam { get; set; }
        public string BuildingName { get; set; }
        public int Seller_Id { get; set; }
        public string Seller_Name { get; set; }
        public string Seller_Address { get; set; }
        public string Seller_City { get; set; }
        public string Seller_Phone { get; set; }
        public string Seller_Fax { get; set; }
        public string Seller_Email { get; set; }
        public int Seller_ContactId { get; set; }
        public string Seller_ContactName { get; set; }
        public string Seller_ContactTitle { get; set; }
        public int Dealer_Type { get; set; }
        public float Value_Rent_Size { get; set; }
        public float Value_Rent_Price { get; set; }
        public int Value_Rent_Period { get; set; }
        public float Value_Rent_Total { get; set; }
        public int Value_Rent_Park_No { get; set; }
        public float Value_Rent_Park_Price { get; set; }
        public int Value_Rent_Park_Period { get; set; }
        public float Value_Rent_Park_Total { get; set; }
        public float Value_Sale_Size { get; set; }
        public float Value_Sale_Price { get; set; }
        //public int Value_Sale_Period { get; set; }
        public float Value_Sale_Total { get; set; }
        public int Value_Sale_Park_No { get; set; }
        public float Value_Sale_Park_Price { get; set; }
        //public int Value_Sale_Park_Period { get; set; }
        public float Value_Sale_Park_Total { get; set; }
        public DateTime? ContractDate { get; set; }
        public DateTime? DateEndContract { get; set; }
        public DateTime? DateEndOption1 { get; set; }
        public DateTime? DateEndOption2 { get; set; }
        public float ComissionNet { get; set; }
        public int AgentId { get; set; }
        public string Comment { get; set; }


        public float TotalValue { get; set; }
        public string Payment_Ex_Item { get; set; }
        public float Payment_Ex_Percent { get; set; }
        public float Payment_Ex_Net { get; set; }
        public int Payment_In_Item_1 { get; set; }
        public float Payment_In_Percent_1 { get; set; }
        public float Payment_In_Net_1 { get; set; }
        public int Payment_In_Item_2 { get; set; }
        public float Payment_In_Percent_2 { get; set; }
        public float Payment_In_Net_2 { get; set; }
        public int Payment_In_Item_3 { get; set; }
        public float Payment_In_Percent_3 { get; set; }
        public float Payment_In_Net_3 { get; set; }
        public int Payment_In_Item_4 { get; set; }
        public float Payment_In_Percent_4 { get; set; }
        public float Payment_In_Net_4 { get; set; }
        public int Trans_Status { get; set; }
        
    }
    public class TransactionPayement : IEntityItem
    {

        public int TransId { get; set; }
        public int Payment_Type { get; set; }
        public string Payment_Item { get; set; }
        public float Payment_Percent { get; set; }
        public float Payment_Amount { get; set; }
        [EntityProperty(EntityPropertyType.Identity)]
        public int RowId { get; set; }
    }
    
}
    
