using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Net.Mail;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using unipark.api.Data;
using unipark.api.DTOs;
using unipark.api.Models;

namespace unipark.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IMapper mapper, ITokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            if (!EmailValid(registerDTO.Email))
                return BadRequest("Email is not valid. Please try it again!");

            if (!PasswordValid(registerDTO.Password))
                return BadRequest("Password is not valid. Please try it again!");

            // If the user is already exist, return BadRequest()
            if (await UserExists(registerDTO.Email))
                return BadRequest("Email is taken. Please try it again!");

            var user = _mapper.Map<AppUser>(registerDTO);

            user.Email = registerDTO.Email.ToLower();

            // This is not ideal, but we use user's email as UserName
            user.UserName = registerDTO.Email.ToLower();

            var result = await _userManager.CreateAsync(user, registerDTO.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            return new UserDTO
            {
                Email = user.Email,
                FirstName = user.FirstName,
                CurrentUserMode = user.CurrentUserMode,
                Token = await _tokenService.GenerateJSONWebToken(user),
            };

        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await _userManager.Users
                .SingleOrDefaultAsync(u => u.Email == loginDTO.Email.ToLower());

            if (user == null)
                return Unauthorized("Email is not valid");

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);

            if (!result.Succeeded) return Unauthorized("Password is not valid");

            // return user;
            return new UserDTO
            {
                Email = user.Email,
                FirstName = user.FirstName,
                CurrentUserMode = user.CurrentUserMode,
                Token = await _tokenService.GenerateJSONWebToken(user),
            };
        }

        // Put: api/account/reset/email
        [AllowAnonymous]
        //[Authorize]
        [HttpPut("reset/{email}")]
        public async Task<ActionResult> ResetPassowrd(string email)
        {
            if (await UserExists(email))
            {
                var updateUser = await _userManager.Users.SingleOrDefaultAsync(u => u.Email == email.ToLower());

                // create your logic to make a new password
                var newPassword = Helpers.RandomPwGenerator.Generate(10, 2);

                // using smtp server to send the reset password email
                try
                {
                    MailMessage mail = new MailMessage();
                    SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");

                    mail.From = new MailAddress("dev.unipark@gmail.com");
                    mail.To.Add(updateUser.Email);
                    mail.Subject = "Reset your password";
                    mail.Body = $"Hello {updateUser.FirstName}: \nWe've received a request to reset your password.\n\nPlease login with the new password: {newPassword}\nYou can change your password after you login.\n\n\n\nThanks,\nThe Unipark team.";

                    SmtpServer.Port = 587;
                    SmtpServer.Credentials = new System.Net.NetworkCredential("dev.unipark@gmail.com", "Fanshawe123");
                    SmtpServer.EnableSsl = true;

                    SmtpServer.Send(mail);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Failed to send a reset password email: " + ex);
                }


                await _userManager.RemovePasswordAsync(updateUser);

                var result = await _userManager.AddPasswordAsync(updateUser, newPassword);

                return Ok(true);
            }
            return BadRequest(false);
        }

        // Put: api/account/change/password
        [AllowAnonymous]
        [HttpPut("change/{newPassword}")]
        public async Task<ActionResult> ChangePasswordAsOwner(string newPassword)
        {
            // Get the userId from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _userManager.Users.Where(u => u.Id == userId).FirstOrDefaultAsync();

            if (user != null)
            {

                await _userManager.RemovePasswordAsync(user);

                var result = await _userManager.AddPasswordAsync(user, newPassword);

                return Ok("New password is updated");
            }

            return BadRequest("Pailed to update a new password");
        }


        private async Task<bool> UserExists(string email)
        {
            return await _userManager.Users.AnyAsync(u => u.Email == email.ToLower());
        }

        private bool EmailValid(string email)
        {
            try
            {
                MailAddress mailAddress = new MailAddress(email);
                return true;
            }
            catch(FormatException)
            {
                return false;
            }
        }

        private bool PasswordValid(string password)
        {
            // minimum 8 characters, minimum 1 number, minimum 1 lowercase, minimum 1 uppercase
            Regex regex = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$");
            Match match = regex.Match(password);
            return match.Success;
        }



        // For tesing purpose
        [AllowAnonymous]
        [HttpGet("Ranking")]
        public async Task<string> GetRanking()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            string currentUserEmail = identity.Claims.ToList().ElementAt(0).Value;
            var currentUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == currentUserEmail);
            return $"{currentUser.FirstName} {currentUser.LastName} has been ranked at {currentUser.Ranking}";
        }

        
    }

}
