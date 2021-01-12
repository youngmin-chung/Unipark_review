using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using unipark.api.Data;
using unipark.api.Helpers;

namespace unipark.api.Extenstions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<IUniparkRepository, UniparkRepository>();

            return services;
        }
    }
}
