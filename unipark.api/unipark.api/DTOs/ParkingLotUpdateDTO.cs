using System;
using unipark.api.Models;

namespace unipark.api.DTOs
{
    public class ParkingLotUpdateDTO
    {
        public string Title { get; set; }
        public DateTime DateTimeIn { get; set; }
        public DateTime DateTimeOut { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string PostalCode { get; set; }
        public string Description { get; set; }
        public int NumberOfSlots { get; set; }
        public bool IsAvailable { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public PriceDTO Price { get; set; }
    }
}
