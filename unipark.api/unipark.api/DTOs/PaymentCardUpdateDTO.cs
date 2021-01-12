using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace unipark.api.DTOs
{
    public class PaymentCardUpdateDTO
    {
        public string Name { get; set; }
        public string CardNumber { get; set; }
        public string ExpiryMonth { get; set; }
        public string ExpiryYear { get; set; }
        public string CVC { get; set; }
    }
}
