using Microsoft.AspNetCore.Identity;

namespace unipark.api.Models
{

    // This is for many to many relationship
    // This is acting as a junction table
    public class AppUserRole : IdentityUserRole<string>
    {
        public AppUser User { get; set; }
        public AppRole Role { get; set; }
    }
}