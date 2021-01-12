using System.Threading.Tasks;
using unipark.api.Models;

namespace unipark.api.Data
{
    public interface ITokenService
    {
        Task<string> GenerateJSONWebToken(AppUser user);
    }
}
