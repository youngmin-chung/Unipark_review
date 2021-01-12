using unipark.api.Models;

namespace unipark.api.DTOs
{
    public class UserDTO
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public UserMode CurrentUserMode { get; set; }
        public string Token { get; set; }
    }
}
