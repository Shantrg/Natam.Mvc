using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Pro.Lib
{
    public class Settings
    {
        public const int AccountId = 1;
        public const string ChoosAll = "===בחר הכל===";
        public const string AppName = "Natam.Crm";


        public const string ProjectName = "Natam";

        public const int DefaultShortTTL = 1;
        public const int DefaultLongTTL = 60;
        public static object NullableToValue(DateTime? item)
        {
            if (item.HasValue)
                return item.Value;
            return null;
        }
        public static object NullableToValue(int? item)
        {
            if (item.HasValue)
                return item.Value;
            return null;
        }
    }
}
