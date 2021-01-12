using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Collections.Generic;

namespace unipark.api.Models
{
    public class Reservation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public double HoursMinutesOfReservation { get; set; }
        public double CostPaid_Driver { get; set; }
        public double CostEarned_Owner { get; set; }
        public double CommissionRate { get; set; }
        public bool IsPaid { get; set; }

        public ReservedParkingLot ReservedParkingLot { get; set; }

        public ICollection<AppUserReservation> UserReservations { get; set; }
        
    }
}
