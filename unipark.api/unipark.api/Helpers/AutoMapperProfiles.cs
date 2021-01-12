using AutoMapper;
using System.Linq;
using unipark.api.DTOs;
using unipark.api.Models;

namespace unipark.api.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // Parking Lot
            CreateMap<ParkingLot, ParkingLotDTO>()
                .ForMember(prop => prop.PhotoUrl, opt => opt.MapFrom(src => 
                    src.Photos.FirstOrDefault(p => p.IsMain).Url));
            CreateMap<ParkingLotDTO, ParkingLot>();
            CreateMap<ParkingLotUpdateDTO, ParkingLot>();
            CreateMap<ParkingLotCreateDTO, ParkingLot>();


            // User 
            CreateMap<RegisterDTO, AppUser>();
            CreateMap<AppUser, UserForAdminDTO>();
            CreateMap<UserUpdateForAdminDTO, AppUser>();

            // User as Driver
            CreateMap<AppUser, DriverDTO>();
            CreateMap<DriverUpdateDTO, AppUser>();

            // User as Property Owner
            CreateMap<AppUser, PropertyOwnerDTO>();
            CreateMap<PropertyOwnerUpdateDTO, AppUser>();

            // Photo
            CreateMap<Photo, PhotoDTO>();

            // Vehicle
            CreateMap<VehicleUpdateDTO, Vehicle>();
            CreateMap<VehicleDTO, Vehicle>();
            CreateMap<Vehicle, VehicleDTO>();
                //.ForMember(prop => prop.User, opt => opt.Ignore());

            // Reservation
            CreateMap<Reservation, ReservationDTO>();
            CreateMap<ReservationCreateDTO, Reservation>();
            CreateMap<ReservedParkingLot, ReservedParkingLotDTO>();

            // Price
            CreateMap<PriceDTO, Price>();
            CreateMap<Price, PriceDTO>();

            // Document
            CreateMap<Document, DocumentDTO>();

            // PaymentCard
            CreateMap<PaymentCardUpdateDTO, PaymentCard>();
            CreateMap<PaymentCardDTO, PaymentCard>();
            CreateMap<PaymentCard, PaymentCardDTO>();
        }
    }
}
