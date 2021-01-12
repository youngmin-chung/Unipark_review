using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using unipark.api.Data;
using unipark.api.DTOs;

namespace unipark.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {

        private readonly IUniparkRepository _repo;
        private readonly IMapper _mapper;

        public AdminController(IUniparkRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        // GET: api/admin
        [Authorize(Policy = "AdminRole")]
        [HttpGet]
        public async Task<ActionResult> GetUsers()
        {
            var users = await _repo.GetUsers();

            var usersToReturn = _mapper.Map<IEnumerable<UserForAdminDTO>>(users);

            return Ok(usersToReturn);
        }

        // GET: api/admin/id
        [Authorize(Policy = "AdminRole")]
        [HttpGet("{id}")]
        public async Task<ActionResult> GetUser(string id)
        {

            if (id == null) return BadRequest();

            var user = await _repo.GetUserById(id);

            if (user == null) return BadRequest("User does not exsit!");
    
            var userToReturn = _mapper.Map<UserForAdminDTO>(user);
            return Ok(userToReturn);
        }

        // PUT: api/admin/id
        [Authorize(Policy = "AdminRole")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUserVerified(string id, UserUpdateForAdminDTO userUpdateForAdminDTO)
        {
            // Get the userId from the token
            var user = await _repo.GetUserById(id);

            if (user != null)
            {
                _mapper.Map(userUpdateForAdminDTO, user);

                _repo.Update(user);

                if (await _repo.SaveAll()) return NoContent();
            }

            return BadRequest("Failed to update user");
        }
    }

    
}
