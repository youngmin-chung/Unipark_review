using Stripe;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace unipark.api.DTOs
{
    public class PaymentDTO
    {
        //public string Name { get; set; }
        //public string CardNumber { get; set; }
        //public int ExpiryMonth { get; set; }
        //public int ExpiryYear { get; set; }
        //public string CVC { get; set; }
        //public int Value { get; set; }

        //public static async Task<dynamic> PayAsync(string cardnumber, int month, int year, int cvc)
        //{
        //    try
        //    {
        //        StripeConfiguration.ApiKey = "sk_test_51HcuVNCzKT7tyY7jGphPIcTNnqsDyGKsKfnC5Afl0R5eIoRm6DhGNRYHqsczkGwgiJUQ1ZZKiH7RZutIQBfnQ9Lc00oDsIEVik";
        //        var optionstoken = new TokenCreateOptions
        //        {
        //            Card = new TokenCardOptions
        //            {
        //                Number = cardnumber,
        //                ExpMonth = month,
        //                ExpYear = year,
        //                Cvc = cvc

        //            }
        //        };
        //        var servicetoken = new TokenService();
        //        Token stripetoken = await servicetoken.CreateAsync(optionstoken);

        //        var options = new ChargeCreateOptions
        //        {
        //            Amount = value,
        //            Currency = "cad",
        //            Description = "test",
        //            Source = stripetoken.Id
        //        };

        //        var service = new ChargeService();
        //        Charge charge = await service.CreateAsync(options);
        //        if (charge.Paid)
        //            return "Success! Payment sent.";
        //        else
        //            return "Failed! Payment rejected.";
        //    }
        //    catch (Exception e)
        //    {
        //        return e.Message;
        //    }

        //    return "Success! Payment sent.";
        //}
    }
}
