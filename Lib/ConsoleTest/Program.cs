
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ConsoleTest
{
    class Program
    {
        static void Main(string[] args)
        {
            int num= Nistec.GenericTypes.Convert<int>("1234");
            Console.WriteLine(num);


            //var o= Nistec.Types.ToDateTimeExact("2016-02-26");
            //Console.WriteLine(o);
            //var list = DealView.View();
            //Console.WriteLine(list.Count());
            Console.ReadLine();
        }
    }
}
