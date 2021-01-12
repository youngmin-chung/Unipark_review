using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using unipark.api.Data;
using unipark.api.DTOs;
using unipark.api.Models;

namespace unipark.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationController : ControllerBase
    {

        private readonly IUniparkRepository _repo;
        private readonly IMapper _mapper;

        public ReservationController(IUniparkRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        // GET: api/reservation
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> GetReservations()
        {
            // Get the userId from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var allReservations = await _repo.GetReservations(userId);

            if (allReservations == null)
                return BadRequest("There is no reservation");

            var reservationToReturn = _mapper.Map<IEnumerable<ReservationDTO>>(allReservations);

            return Ok(reservationToReturn);
        }


        // GET: api/reservation/id
        [AllowAnonymous]
        [HttpGet("{id}", Name = "GetReservation")]
        public async Task<ActionResult> GetReservation(int id)
        {
            var reservation = await _repo.GetReservationById(id);

            var reservationToReturn = _mapper.Map<ReservationDTO>(reservation);

            return Ok(reservationToReturn);
        }


        // POST: api/reservation/parkingId
        // What need? userId, VehicleId, ParkingId
        [AllowAnonymous]
        [HttpPost("{parkingLotId}")]
        public async Task<ActionResult> CreateReservation(int parkingLotId, ReservationCreateDTO reservationCreateDTO)
        {
            // Get the userId from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var userFromRepo = await _repo.GetUserById(userId);

            var reservation = _mapper.Map<Reservation>(reservationCreateDTO);

            var vehicle = userFromRepo.Vehicles.FirstOrDefault();

            var parkinglot = await _repo.GetParkingLotById(parkingLotId);


            if (vehicle != null && parkinglot != null)
            {
                _repo.Add(reservation);
            }
            else
            {
                BadRequest("Could not add the reservation");
            }

            // Save a new reservation
            if(await _repo.SaveAll())
            {
                // For driver
                var userReservation = new AppUserReservation
                {
                    User = userFromRepo,
                    UserId = userId,
                    Reservation = reservation,
                    ReservationId = reservation.Id
                };

                _repo.Add(userReservation);

                // For owner
                var ownerReservation = new AppUserReservation
                {
                    User = parkinglot.User,
                    UserId = parkinglot.UserId,
                    Reservation = reservation,
                    ReservationId = reservation.Id
                };

                _repo.Add(ownerReservation);

                var reservedParkingLot = new ReservedParkingLot
                {
                    PhotoUrl = parkinglot.PhotoUrl,
                    Title = parkinglot.Title,
                    City = parkinglot.City,
                    Address = parkinglot.Address,
                    PostalCode = parkinglot.PostalCode
                };

                //_repo.Add(reservedParkingLot);

                reservation.ReservedParkingLot = reservedParkingLot;

                if (await _repo.SaveAll())
                {
                    var reservationToReturn = _mapper.Map<ReservationDTO>(reservation);
                    return CreatedAtRoute("GetReservation", new { id = reservation.Id }, reservationToReturn);
                }
            }  

            return BadRequest("Could not add the reservation");
        }

    }
}
