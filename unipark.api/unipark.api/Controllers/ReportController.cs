using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using unipark.api.Data;
using unipark.api.DTOs;
using unipark.api.Models;

namespace unipark.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IUniparkRepository _repo;
        private readonly IMapper _mapper;


        public ReportController(IUniparkRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        // GET: api/report
        // To-Do : changed this to [Authorize] later
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> GetReports()
        {
            var reports = await _repo.GetReports();

            var reportsToReturn = _mapper.Map<IEnumerable<Report>>(reports);

            return Ok(reportsToReturn);
        }

        [AllowAnonymous]
        [HttpPost("AddReport")]
        public async Task<ActionResult> AddReport([FromBody] Report report)
        {
            if (report != null)
            {
                _repo.Add(report);

            }

            if (await _repo.SaveAll())
            {
                return Ok("Success");
            }

            return BadRequest("Failed");
        }

        //[HttpPost("registerReport")]
        //public async Task<ActionResult<ReportDTO>> Register(ReportCreateDTO registerReport)
        //{
        //    // If the user is already exist, return BadRequest()
        //    //if (await UserExists(registerDTO.Email))
        //    //    return BadRequest("Email is taken");

        //    var report = _mapper.Map<Report>(registerReport);

        //    //user.Email = registerDTO.Email.ToLower();

        //    // This is not ideal, but we use user's email as UserName now
        //    // - I will fix this later
        //    //user.UserName = registerDTO.Email.ToLower();

        //    //var result = await _userManager.CreateAsync(user, registerDTO.Password);

        //    //if (!result.Succeeded) return BadRequest(result.Errors);

        //    return new ReportDTO
        //    {
        //        Id = report.Id,
        //        UserId = report.UserId,
        //        UserEmail = report.UserEmail,
        //        IssueType = report.IssueType,
        //        Description = report.Description,
        //        DateTimeIn = new DateTime(),
        //        isDone = report.isDone
        //    };

        //}
    }
}
