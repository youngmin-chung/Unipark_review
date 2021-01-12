using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using unipark.api.Data;
using unipark.api.DTOs;
using unipark.api.Models;

namespace unipark.api.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUniparkRepository _repo;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UserController(IUniparkRepository repo, IMapper mapper, IPhotoService photoService, UserManager<AppUser> userManager)
        {
            _repo = repo;
            _mapper = mapper;
            _photoService = photoService;
            _userManager = userManager;
        }

        // GET: api/user
        //[HttpGet("{id}", Name = "GetUser")]
        //[HttpGet("{id}")]
        [AllowAnonymous]
        [HttpGet(Name = "GetUser")]
        public async Task<ActionResult> GetUser()
        {
            // Get the userId from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null) return Unauthorized();
            
            var user = await _repo.GetUserById(userId);

            if (user == null) return BadRequest();

            if (user.CurrentUserMode == UserMode.Driver)
            {
                var driver = _mapper.Map<DriverDTO>(user);
                return Ok(driver);
            }

            var propertyOwner = _mapper.Map<PropertyOwnerDTO>(user);
            return Ok(propertyOwner);
        }

        // PUT: api/user/driver
        [AllowAnonymous]
        [HttpPut("driver")]
        public async Task<ActionResult> UpdateDriver(DriverUpdateDTO driverUpdateDTO)
        {
            // Get the userId from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _repo.GetUserById(userId);

            // Check the current UserMode to restirct updating from the owner mode
            if (user.CurrentUserMode == UserMode.Driver)
            {
                _mapper.Map(driverUpdateDTO, user);

                _repo.Update(user);

                if (await _repo.SaveAll()) return NoContent();
            }

            return BadRequest("Failed to update user");
        }

        // PUT: api/user/owner/
        [AllowAnonymous]
        [HttpPut("owner")]
        public async Task<ActionResult> UpdateOwner(PropertyOwnerUpdateDTO propertyOwnerUpdateDTO)
        {
            // Get the userId from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _repo.GetUserById(userId);

            // Check the current UserMode to restirct updating from the driver mode
            if (user.CurrentUserMode == UserMode.PropertyOwner)
            {

                _mapper.Map(propertyOwnerUpdateDTO, user);

                _repo.Update(user);

                if (await _repo.SaveAll())
                {
                    //if(propertyOwnerUpdateDTO.Password != null)
                    //{
                    //    // Update the password
                    //    await _userManager.RemovePasswordAsync(user);

                    //    var result = await _userManager.AddPasswordAsync(user, propertyOwnerUpdateDTO.Password);

                    //    if (!result.Succeeded) return Unauthorized("Failed to update user");
                    //}
                    

                    return NoContent();
                }
                
            }
             
            return BadRequest("Failed to update user");
        }

        // POST: api/user/document
        [AllowAnonymous]
        [HttpPost("document")]
        public async Task<ActionResult<PhotoDTO>> AddDocument(IFormFile file)
        {

            // Get the userId from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _repo.GetUserById(userId);

            if (user == null) return BadRequest("user is not exist");

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var document = new Document
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            user.Documents.Add(document);

            if (await _repo.SaveAll())
            {
                var documentToReturn = _mapper.Map<DocumentDTO>(document);
                return Ok(documentToReturn);
            }

            return BadRequest("Could not add the document");
        }

        // DELETE: api/user/document/documentId
        [AllowAnonymous]
        [HttpDelete("document/{documentId}")]
        public async Task<ActionResult> DeleteDocument(int documentId)
        {

            // Get the userId from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _repo.GetUserById(userId);

            var document = user.Documents.FirstOrDefault(d => d.Id == documentId);

            if (document == null) return NotFound();

            if (document.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(document.PublicId);

                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Documents.Remove(document);

            if (await _repo.SaveAll())
            {
                var documentToReturn = _mapper.Map<DocumentDTO>(document);
                return CreatedAtRoute("GetUser", documentToReturn);
            }

            return BadRequest("Failed to delete the document");
        }

    }
}
