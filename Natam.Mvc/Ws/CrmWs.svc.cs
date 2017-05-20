using Nistec;
using Pro.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

namespace Natam.Mvc.Ws
{
    [ServiceContract(Namespace = "")]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CrmWs
    {
        // To use HTTP GET, add [WebGet] attribute. (Default ResponseFormat is WebMessageFormat.Json)
        // To create an operation that returns XML,
        //     add [WebGet(ResponseFormat=WebMessageFormat.Xml)],
        //     and include the following line in the operation body:
        //         WebOperationContext.Current.OutgoingResponse.ContentType = "text/xml";
        [OperationContract]
        public void DoWork()
        {
            // Add your operation implementation here
            return;
        }

         [OperationContract]
        public string GetAccountDetails(string id)
        {
            int accountId = Types.ToInt(id);
            if (accountId <= 0)
                return "";
            var entity = AccountView.Get(accountId);
            if (entity == null)
                return "";
            return entity.ToHtml();
        }

         [OperationContract]
        public string GetContactDetails(string id)
        {
            int contactId = Types.ToInt(id);
            if (contactId <= 0)
                return "";
            var entity = ContactView.Get(contactId);
            if (entity == null)
                return "";
            return entity.ToHtml();
        }

         [OperationContract]
        public string GetOwnerDetails(string id)
        {
            int accountId = Types.ToInt(id);
            if (accountId <= 0)
                return "";
            var entity = AccountView.Get(accountId);
            if (entity == null)
                return "";
            return entity.ToHtml();
        }

         [OperationContract]
        public int ContactDelete(string id)
        {
            int contactId = Types.ToInt(id);
            if (contactId <= 0)
                return 0;
            return ContactContext.DoDelete(contactId);
        }

         [OperationContract]
        public int AccountNewsDelete(int AccountId, int NewsId)
        {
            if (AccountId <= 0 || NewsId <= 0)
                return 0;
            return AccountNewsView.DeleteNews(AccountId, NewsId);
        }
    }
}
