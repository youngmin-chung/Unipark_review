using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace unipark.api.Models
{
    public class AppUser : IdentityUser
    {
        
        //public int Id { get; set; } // Inherited from the IdentityUser class
        public string FirstName { get; set; }
        public string LastName { get; set; }
        //public string PhoneNumber { get; set; } // Inherited from the IdentityUser class
        public string EmergencyContact { get; set; }
        public string VerifiedDocImage { get; set; }// this will store path to image
        public bool IsVerified { get; set; }
        //public string Email { get; set; } // Inherited from the IdentityUser class
        //public string PasswordHash { get; set; } // Inherited from the IdentityUser class
        public bool IsPasswordReset { get; set; }
        public bool IsDriver { get; set; }
        public bool IsOwner { get; set; }
        public double Ranking { get; set; }
        public UserMode CurrentUserMode { get; set; }
        public PaymentCard PaymentCard { get; set; }

        public ICollection<ParkingLot> ParkingLots { get; set; }
        public ICollection<Vehicle> Vehicles { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }
        public ICollection<AppUserReservation> UserReservations { get; set; }
        public ICollection<Document> Documents { get; set; }
    }
}
