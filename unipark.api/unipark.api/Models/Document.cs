using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace unipark.api.Models
{
    [Table("Document")]
    public class Document
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [ForeignKey("UserId")]
        public AppUser User { get; set; }
        [Required]
        public string UserId { get; set; }
        public string Url { get; set; }

        // For Cloudinary
        public string PublicId { get; set; }
    }
}
