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
    public class VehicleController : ControllerBase
    {
        private readonly IUniparkRepository _repo;
        private readonly IMapper _mapper;

        public VehicleController(IUniparkRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        // GET: api/vehicle
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> GetVehicle()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var vehicle = await _repo.GetVehicleByUserId(userId);

            var vehicleToReturn = _mapper.Map<VehicleDTO>(vehicle);

            return Ok(vehicleToReturn);
        }

        // PUT: api/vehicle
        [AllowAnonymous]
        [HttpPut]
        public async Task<ActionResult> UpdateVehicle(VehicleUpdateDTO vehicleUpdateDTO)
        {
            // Get the userId from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var vehicle = await _repo.GetVehicleByUserId(userId);

            if (vehicle.UserId == userId)
            {
                _mapper.Map(vehicleUpdateDTO, vehicle );

                _repo.Update(vehicle);

                // if the repo is saved successfully, return NoContent
                if (await _repo.SaveAll()) return NoContent();
            }

            // if the error comes out
            return BadRequest("Failed to update vehicle");
        }

        // POST: api/vehicle
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> CreateVehicle(VehicleDTO vehicleDTO)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var userFromRepo = await _repo.GetUserById(userId);

            var vehicle = _mapper.Map<Vehicle>(vehicleDTO);

            userFromRepo.Vehicles.Add(vehicle);

            if (await _repo.SaveAll())
            {
                var vehicleToReturn = _mapper.Map<VehicleDTO>(vehicle);
                return Ok(vehicleToReturn);
            }

            return BadRequest("Could not add vehicle");
        }
    }
}