using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using unipark.api.Models;

namespace unipark.api.Data
{
    public class UniparkRepository : IUniparkRepository
    {
        private readonly AppDbContext _db;

        public UniparkRepository(AppDbContext dbContext)
        {
            _db = dbContext;
        }

        public void Add<T>(T entity) where T : class
        {
            _db.Add(entity);
        }
        public void Delete<T>(T entity) where T : class
        {
            _db.Remove(entity);
        }
        public void Update<T>(T entity) where T : class
        {
            _db.Entry(entity).State = EntityState.Modified;
        }
        public async Task<bool> SaveAll()
        {
            return await _db.SaveChangesAsync() > 0;
        }


        // User
        public async Task<AppUser> GetUserById(string id)
        {
            return await _db.Users.Include(c => c.ParkingLots).Include(c => c.Vehicles).Include(c => c.Documents).Include(c => c.PaymentCard).SingleOrDefaultAsync(c => c.Id == id);
        }
        public async Task<AppUser> GetUserByEmail(string enmail)
        {
            return await _db.Users.Include(c => c.ParkingLots).Include(c => c.Vehicles).Include(c => c.Documents).Include(c => c.PaymentCard).SingleOrDefaultAsync(c => c.Email == enmail);
        }
        public async Task<IEnumerable<AppUser>> GetUsers()
        {
            var users = await _db.Users.Include(c => c.ParkingLots).Include(c => c.Vehicles).Include(c => c.Documents).Include(c => c.PaymentCard).ToListAsync();
            return users;
        }


        // Parking Lot
        public async Task<ParkingLot> GetParkingLotById(int id)
        {
            return await _db.ParkingLots.Include(p => p.User).Include(p => p.Photos).Include(p => p.Price).SingleOrDefaultAsync(p => p.Id == id);
        }
        public async Task<IEnumerable<ParkingLot>> GetParkingLots()
        {
            var parkinglots = await _db.ParkingLots.Include(p => p.User).Include(p => p.Photos).Include(p => p.Price).ToListAsync();
            return parkinglots;
        }
        public async Task<IEnumerable<ParkingLot>> GetListingParkingLots(string userId)
        {
            var parkinglots = await _db.ParkingLots.Where(p => p.UserId == userId).Include(p => p.Photos).Include(p=>p.Price).ToListAsync();
            return parkinglots;
        }


        // Vehicle
        public async Task<Vehicle> GetVehicleByUserId(string id)
        {
            return await _db.Vehicles.Include(v => v.User).FirstOrDefaultAsync(v => v.UserId == id);
        }
        public async Task<IEnumerable<Vehicle>> GetVehicles()
        {
            return await _db.Vehicles.ToListAsync();
        }

        // Report
        public async Task<IEnumerable<Report>> GetReports()
        {
            return await _db.Reports.ToListAsync();
        }

        public async Task<Report> GetReportByEmail(string userEmail)
        {
            return await _db.Reports.FirstOrDefaultAsync(v => v.UserEmail == userEmail);
        }


        public void AddReport(Report report)
        {
            _db.Reports.Add(report);
        }


        // Reservation
        public async Task<Reservation> GetReservationById(int id)
        {
            var reservation = await _db.Reservations.Include(r => r.ReservedParkingLot).SingleOrDefaultAsync(r => r.Id == id);
            return reservation;
        }
        public async Task<IEnumerable<Reservation>> GetReservations(string userId)
        {
            var reservations = await _db.Reservations.Where(r => r.UserReservations.Any(ur => ur.UserId == userId)).Include(r => r.ReservedParkingLot).ToListAsync();
            return reservations;
        }


        // Price
        public async Task<Price> GetPriceByParkingLotId(int id)
        {
            return await _db.Prices.FirstOrDefaultAsync(p => p.ParkingLotId == id);
        }
    }
}
