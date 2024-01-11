using TaniumApi.Library.DataAccess;

namespace TaniumApi;

public static class RegisterServices
{
    public static void ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddMemoryCache();

        builder.Services.AddTransient<ISqlDataAccess, SqlDataAccess>();
        builder.Services.AddTransient<IUserData, UserData>();
    }
}
