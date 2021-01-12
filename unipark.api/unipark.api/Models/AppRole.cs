using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace unipark.api.Models
{
    public class AppRole : IdentityRole
    {
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}