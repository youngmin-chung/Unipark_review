using System.Collections.Generic;
using unipark.api.Models;

namespace unipark.api.DTOs
{
    public class PropertyOwnerUpdateDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public double Ranking { get; set; }
        public string Email { get; set; }
        public string EmergencyContact { get; set; }
        public int CurrentUserMode { get; set; }
    }
}
