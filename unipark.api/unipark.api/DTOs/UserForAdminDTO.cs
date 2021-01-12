using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using unipark.api.Models;

namespace unipark.api.DTOs
{
    public class UserForAdminDTO
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string EmergencyContact { get; set; }
        public string VerifiedDocImage { get; set; }
        public bool IsVerified { get; set; }
        public string Email { get; set; }
        public bool IsDriver { get; set; }
        public bool IsOwner { get; set; }
        public double Ranking { get; set; }

        public ICollection<ParkingLotDTO> ParkingLots { get; set; }
        public ICollection<VehicleDTO> Vehicles { get; set; }
        public ICollection<DocumentDTO> Documents { get; set; }

    }
}
