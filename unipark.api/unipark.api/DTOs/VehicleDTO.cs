using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace unipark.api.DTOs
{
    public class VehicleDTO
    {
        public int Id { get; set; }
        public string PlateNumber { get; set; }
        public string Year { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public string Color { get; set; }
    }
}