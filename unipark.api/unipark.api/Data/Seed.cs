using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using unipark.api.Models;

namespace unipark.api.Data
{
    public class Seed
    {
        public static async Task SeedData(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            // if the user table has any data, just return
            if (await userManager.Users.AnyAsync()) return;

        
            var data = await System.IO.File.ReadAllTextAsync("Data/UniparkSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(data);

            // if the user table doesn't have any data
            if (users == null) return;

            var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"}
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                user.Email = user.Email.ToLower();
                user.UserName = user.Email.ToLower();

                await userManager.CreateAsync(user, "1q2w3e4R5T6Y");
                await userManager.AddToRoleAsync(user, "Member");
            }


            // Add admin account
            var admin = new AppUser
            {
                Email = "admin@gmail.com",
                UserName = "admin@gmail.com",
                FirstName = "Admin"
            };

            await userManager.CreateAsync(admin, "1q2w3e4R5T6Y");
            await userManager.AddToRoleAsync(admin, "Admin");

        }
    }
}
