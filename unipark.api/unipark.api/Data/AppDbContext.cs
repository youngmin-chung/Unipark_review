using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using unipark.api.Models;

namespace unipark.api.Data
{
    public class AppDbContext : IdentityDbContext<AppUser, AppRole, string,
        IdentityUserClaim<string>, AppUserRole, IdentityUserLogin<string>,
        IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        public virtual DbSet<Vehicle> Vehicles { get; set; }
        public virtual DbSet<PaymentCard> PaymentCards { get; set; }
        public virtual DbSet<ParkingLot> ParkingLots { get; set; }
        public virtual DbSet<Reservation> Reservations { get; set; }
        public virtual DbSet<Price> Prices { get; set; }
        // Add report
        public virtual DbSet<Report> Reports { get; set; }
        public virtual DbSet<AppUserReservation> UserReservations { get; set; }
        public virtual DbSet<ReservedParkingLot> ReservedParkingLots { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppUser>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();

            builder.Entity<AppRole>()
               .HasMany(ur => ur.UserRoles)
               .WithOne(r => r.Role)
               .HasForeignKey(r => r.RoleId)
               .IsRequired();

            builder.Entity<AppUser>()
                .HasMany(ur => ur.UserReservations)
                .WithOne(u => u.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();

            builder.Entity<Reservation>()
               .HasMany(ur => ur.UserReservations)
               .WithOne(r => r.Reservation)
               .HasForeignKey(r => r.ReservationId)
               .IsRequired();

            builder.Entity<ParkingLot>()
                .HasOne(p => p.Price)
                .WithOne(p => p.ParkingLot)
                .HasForeignKey<Price>(p => p.ParkingLotId);

            builder.Entity<AppUser>()
                .HasOne(p => p.PaymentCard)
                .WithOne(p => p.User)
                .HasForeignKey<PaymentCard>(p => p.UserId);
        }

    }
}
