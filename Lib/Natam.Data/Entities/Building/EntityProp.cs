using Nistec;
using Nistec.Data;
using Pro.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Pro.Data.Entities
{
    public class EntityProp
    {



        public static int PropertyRemove(string PropType, int PropId, int Replacement)
        {

            var parameters = DataParameter.GetSqlList("PropType", PropType, "PropId", PropId, "Replacement", Replacement);
            DataParameter.AddOutputParameter(parameters, "Result", System.Data.SqlDbType.Int, 4);

            int res = DbNatam.Instance.ExecuteNonQuery("sp_Property_Remove", parameters.ToArray(), System.Data.CommandType.StoredProcedure);
            var status = Types.ToInt(parameters[3].Value);
            return status;

        }
    }
}
