using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace unipark.api.Models
{
    public class PaymentCard
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [ForeignKey("UserId")]
        public AppUser User { get; set; }
        [Required]
        public string UserId { get; set; }
        public string Name { get; set; }
        public string CardType { get; set; }
        public string CardNumber { get; set; }
        public string ExpiryMonth { get; set; }
        public string ExpiryYear { get; set; }
        public string CVC { get; set; }
        public string CurrencyType { get; set; }
    }
}
