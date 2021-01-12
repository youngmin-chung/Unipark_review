using System.Collections.Generic;
using unipark.api.Models;

namespace unipark.api.DTOs
{
    public class DriverUpdateDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string EmergencyContact { get; set; }
        public bool IsDriver { get; set; }
        public bool IsOwner { get; set; }
        public UserMode CurrentUserMode { get; set; }
    }
}
