using Nistec;
using Nistec.Data;
using Nistec.Data.Factory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using WebMatrix.Data;

namespace Natam.Data
{
    public class DbCrm:IDisposable
    {
        Database DB;

        public DbCrm()
        {
            DB = Database.Open("cnn_natam");
        }

        public void Dispose()
        {
            DB.Dispose();
        }

        public IEnumerable<dynamic> RetriveData()
        {
            return DB.Query("SELECT * FROM Trace_Act");
        }

    }
}
