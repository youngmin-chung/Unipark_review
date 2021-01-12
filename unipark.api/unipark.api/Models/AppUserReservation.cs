using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace unipark.api.Models
{
    // This is for many to many relationship
    // This is acting as a junction table
    public class AppUserReservation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("UserId")]
        public AppUser User { get; set; }
        public string UserId { get; set; }

        [ForeignKey("ReservationId")]
        public Reservation Reservation { get; set; }
        public int ReservationId { get; set; }
    }
}
