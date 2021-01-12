using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace unipark.api.DTOs
{
    public class ReservationCreateDTO
    {

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public double HoursMinutesOfReservation { get; set; }
        public double CostPaid_Driver { get; set; }
        public double CostEarned_Owner { get; set; }
        public double CommissionRate { get; set; }
        public bool IsPaid { get; set; }
    }
}
