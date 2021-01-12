using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace unipark.api.Models
{
    [Table("Photos")]
    public class Photo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [ForeignKey("ParkingLotId")]
        public ParkingLot ParkingLot { get; set; }
        [Required]
        public int ParkingLotId { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }

        // For Cloudinary
        public string PublicId { get; set; }


    }
}
