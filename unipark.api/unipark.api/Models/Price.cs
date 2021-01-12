using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace unipark.api.Models
{
    public class Price
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [ForeignKey("ParkingLotId")]
        public ParkingLot ParkingLot { get; set; }
        [Required]
        public int ParkingLotId { get; set; }
        public int DayOfWeek { get; set; }// 0 - 6 : Sunday - Saturday
        public double MorningPrice { get; set; }
        public double AfternoonPrice { get; set; }
        public double EveningPrice { get; set; }
        public double WholeDayPrice { get; set; }
        public double PricePerHour { get; set; }
    }
}
