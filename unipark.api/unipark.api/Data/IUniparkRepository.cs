using System.Collections.Generic;
using System.Threading.Tasks;
using unipark.api.Models;

namespace unipark.api.Data
{
    public interface IUniparkRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        void Update<T>(T entity) where T : class;
        Task<bool> SaveAll();

        Task<AppUser> GetUserById(string id);
        Task<AppUser> GetUserByEmail(string enmail);
        Task<IEnumerable<AppUser>> GetUsers();

        // ParkingLot
        Task<IEnumerable<ParkingLot>> GetParkingLots();
        Task<ParkingLot> GetParkingLotById(int id);
        Task<IEnumerable<ParkingLot>> GetListingParkingLots(string userId);

        Task<IEnumerable<Vehicle>> GetVehicles();
        Task<Vehicle> GetVehicleByUserId(string id);

        // Report 
        Task<IEnumerable<Report>> GetReports();
        Task<Report> GetReportByEmail(string userEmail);
        void AddReport(Report report);

        // Reservation
        Task<Reservation> GetReservationById(int id);
        Task<IEnumerable<Reservation>> GetReservations(string userId);

        // Price
        Task<Price> GetPriceByParkingLotId(int id);
    }
}
