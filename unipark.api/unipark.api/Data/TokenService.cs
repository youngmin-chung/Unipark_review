using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using unipark.api.Models;

namespace unipark.api.Data
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _securityKey;
        private readonly UserManager<AppUser> _userManager;
        private readonly string _issuer;
        private readonly string _audience;
        public TokenService(IConfiguration config, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            _issuer = config["Jwt:Issuer"];
            _audience = config["Jwt:Issuer"];
        }
        public async Task<string> GenerateJSONWebToken(AppUser user)
        {
            var credentials = new SigningCredentials(_securityKey, SecurityAlgorithms.HmacSha512Signature);

            var claims = new List<Claim>
            {
                // Save Id and FirtName in the token
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Email),
                new Claim(JwtRegisteredClaimNames.NameId, user.Id),
                new Claim(JwtRegisteredClaimNames.GivenName, user.FirstName)
            };

            var roles = await _userManager.GetRolesAsync(user);

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                //Issuer = _issuer,
                //Audience = _audience,
                NotBefore = DateTime.Now,
                Expires = DateTime.Now.AddMinutes(120),
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var encodeToken = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(encodeToken);
        }
    }
}
