using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using unipark.api.Data;
using unipark.api.DTOs;
using unipark.api.Models;

namespace unipark.api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ParkingLotController : ControllerBase
    {
        private readonly IUniparkRepository _repo;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public ParkingLotController(IUniparkRepository repo, IMapper mapper, IPhotoService photoService)
        {
            _repo = repo;
            _mapper = mapper;
            _photoService = photoService;
        }

        // GET: api/parkinglot
        // To-Do : changed this to [Authorize] later
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> GetParkingLots()
        {
            var parkinglots = await _repo.GetParkingLots();

            var parkinglotsToReturn = _mapper.Map<IEnumerable<ParkingLotDTO>>(parkinglots);

            return Ok(parkinglotsToReturn);
        }

        // GET: api/parkinglot/owner
        // To-Do : changed this to [Authorize] later
        [AllowAnonymous]
        [HttpGet("owner")]
        public async Task<ActionResult> GetListingParkingLots()
        {
            // Get the userId from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var parkinglots = await _repo.GetListingParkingLots(userId);

            var parkinglotsToReturn = _mapper.Map<IEnumerable<ParkingLotDTO>>(parkinglots);

            return Ok(parkinglotsToReturn);
        }


        // GET: api/parkinglot/id
        [AllowAnonymous]
        [HttpGet("{id}", Name = "GetParkingLot")]
        public async Task<ActionResult> GetParkingLot(int id)
        {
            var parkinglot = await _repo.GetParkingLotById(id);

            var parkinglotToReturn = _mapper.Map<ParkingLotDTO>(parkinglot);

            return Ok(parkinglotToReturn);
        }

        // PUT: api/parkinglot/id
        [AllowAnonymous]
        [HttpPut("{parkingLotId}")]
        public async Task<ActionResult> UpdateParkingLot(int parkingLotId, ParkingLotUpdateDTO parkingLotUpdateDTO)
        {
            // Get the userId from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var parkinglot = await _repo.GetParkingLotById(parkingLotId);

            // If the parkinglot is listed by the current user, then the user can update
            if (parkinglot.UserId == userId)
            {
                _mapper.Map(parkingLotUpdateDTO, parkinglot);

                _repo.Update(parkinglot);

                // if the repo is saved successfully, return NoContent
                if (await _repo.SaveAll()) return NoContent();  
            }

            // if the error comes out
            return BadRequest("Failed to update parking lot");
        }

        // POST: api/parkinglot/userId
        [AllowAnonymous]
        [HttpPost("{userId}")]
        public async Task<ActionResult> CreateParkingLot(string userId, ParkingLotCreateDTO parkingLotCreateDTO)
        {
            // Check to see if the user is the current user as pass the token up to our server
            if (userId != User.FindFirst(ClaimTypes.NameIdentifier).Value)
                return Unauthorized();

            var userFromRepo = await _repo.GetUserById(userId);

            var parkinglot = _mapper.Map<ParkingLot>(parkingLotCreateDTO);

            parkinglot.Photos = new List<Photo>();
            parkinglot.NumberOfSlots = 1;
            parkinglot.IsAvailable = true;

            userFromRepo.ParkingLots.Add(parkinglot);

            // Save a new parkingLot
            if (await _repo.SaveAll())
            {
                var parkinglotToReturn = _mapper.Map<ParkingLotDTO>(parkinglot);
                return CreatedAtRoute("GetParkingLot", new { id = parkinglot.Id }, parkinglotToReturn);
            }


            return BadRequest("Could not add the parking lot");
        }

        // DELETE: api/parkinglot/id
        [AllowAnonymous]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteParkingLot(int id)
        {
            var parkingLot = await _repo.GetParkingLotById(id);

            if (parkingLot == null)
                return NotFound();

            _repo.Delete(parkingLot);

            if (await _repo.SaveAll())
            {
                return NoContent();
            }

            return BadRequest("Could not delete the parking lot");
        }



        // POST: api/parkinglot/photo/id
        [AllowAnonymous]
        [HttpPost("photo/{parkingLotId}")]
        public async Task<ActionResult<PhotoDTO>> AddPhoto(int parkingLotId, IFormFile file)
        {

            var parkinglot = await _repo.GetParkingLotById(parkingLotId);

            if(parkinglot == null) return BadRequest("parkingLot is not exist");

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (parkinglot.Photos.Count == 0)
            {
                photo.IsMain = true;
                parkinglot.PhotoUrl = result.SecureUrl.AbsoluteUri; 
            }

            parkinglot.Photos.Add(photo);

            if (await _repo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoDTO>(photo);
                return Ok(photoToReturn);
            }

            return BadRequest("Could not add the photo");
        }

        // PUT: api/parkinglot/photo-update/parkingLotId/photoId
        // [Authorize] // For some reasons, it is not working
        [HttpPut("photo-update/{parkingLotId}/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int parkingLotId, int photoId)
        {
            var parkinglot = await _repo.GetParkingLotById(parkingLotId);

            if (parkinglot == null) return BadRequest("parkingLot is not exist");

            var photo = parkinglot.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo.IsMain) return BadRequest("This is already your main photo");

            var currentMain = parkinglot.Photos.FirstOrDefault(p => p.IsMain);

            // If there is the main photo, it sets to false
            if (currentMain != null) currentMain.IsMain = false;

            // Set the new photo as main
            photo.IsMain = true;

            // Change the current main photo to a new photo
            parkinglot.PhotoUrl = photo.Url;


            if (await _repo.SaveAll())
            {
                var parkinglotToReturn = _mapper.Map<ParkingLotDTO>(parkinglot);
                return CreatedAtRoute("GetParkingLot", new { id = parkinglot.Id }, parkinglotToReturn);
            }

            return BadRequest("Failed to set main photo");
        }


        // DELETE: api/parkinglot/photo-delete/parkingLotId/photoId
        [AllowAnonymous]
        [HttpDelete("photo-delete/{parkingLotId}/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int parkingLotId, int photoId)
        {

            var parkinglot = await _repo.GetParkingLotById(parkingLotId);

            var photo = parkinglot.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo == null) return NotFound();

            if (photo.IsMain) return BadRequest("You cannot delete the main photo");

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);

                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            parkinglot.Photos.Remove(photo);

            if (await _repo.SaveAll())
            {
                var parkinglotToReturn = _mapper.Map<ParkingLotDTO>(parkinglot);
                return CreatedAtRoute("GetParkingLot", new { id = parkinglot.Id }, parkinglotToReturn);
            }

            return BadRequest("Failed to delete the photo");
        }

    }
}
