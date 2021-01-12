using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace unipark.api.DTOs
{
    public class ReservedParkingLotDTO
    {

        public string PhotoUrl { get; set; }
        public string Title { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string PostalCode { get; set; }
    }
}
