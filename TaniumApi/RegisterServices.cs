using Clerk.Net.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Threading.RateLimiting;
using TaniumApi.Authentication;
using TaniumApi.Authentication.Interfaces;
using TaniumApi.Heath;
using TaniumApi.Library.Cache;
using TaniumApi.Library.Cache.Interfaces;
using TaniumApi.Library.DataAccess;
using TaniumApi.Library.DataAccess.Interfaces;

namespace TaniumApi;

public static class RegisterServices
{
    public static void ConfigureServices(this WebApplicationBuilder builder)
    {
        const string RedisInstanceName = "Tanium_";
        string redisConfiguration = builder.Configuration.GetConnectionString("Redis");

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddHealthChecks()
            .AddCheck<DatabaseHealthCheck>("Database")
            .AddCheck<RedisHealthCheck>("Redis");

        builder.Services.AddMemoryCache();
        builder.Services.AddOutputCache(options =>
        {
            options.AddPolicy("Default", builder => 
            {
                builder.Expire(TimeSpan.FromSeconds(30));
            });
        }).AddStackExchangeRedisCache(options =>
        {
            options.InstanceName = RedisInstanceName;
            options.Configuration = redisConfiguration;
        });

        builder.Services.AddTransient<ISqlDataAccess, SqlDataAccess>();
        builder.Services.AddTransient<IUserData, UserData>();
        builder.Services.AddTransient<ICommunityData, CommunityData>();
        builder.Services.AddTransient<IPostData, PostData>();
        builder.Services.AddTransient<IReplyData, ReplyData>();
        builder.Services.AddTransient<IMemberData, MemberData>();
        builder.Services.AddTransient<IVoteData, VoteData>();

        builder.Services.AddTransient<IAuthService, AuthService>();
        builder.Services.AddTransient<IRedisCache, RedisCache>();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin",
                policy => policy.WithOrigins(builder.Configuration["AllowedOrigins:Url"])
                    .AllowAnyMethod()
                    .AllowAnyHeader());
        });

        builder.Services.AddRateLimiter(_ => _
         .AddFixedWindowLimiter(policyName: "fixed", options =>
         {
             options.PermitLimit = 50;
             options.Window = TimeSpan.FromSeconds(12);
             options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
             options.QueueLimit = 2;
         }));

        builder.Services.AddClerkApiClient(config =>
        {
            config.SecretKey = builder.Configuration["Clerk:SecretKey"];
        });

        builder.Services.AddStackExchangeRedisCache(options =>
        {
            options.InstanceName = RedisInstanceName;
            options.Configuration = redisConfiguration;
        });

        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
           .AddJwtBearer(x =>
           {
               // Authority is the URL of your clerk instance
               x.Authority = builder.Configuration["Clerk:Authority"];
               x.TokenValidationParameters = new TokenValidationParameters()
               {
                   // Disable audience validation as we aren't using it
                   ValidateAudience = false,
                   NameClaimType = ClaimTypes.NameIdentifier
               };
               x.Events = new JwtBearerEvents()
               {
                   // Additional validation for AZP claim
                   OnTokenValidated = context =>
                   {
                       var azp = context.Principal?.FindFirstValue("azp");
                       // AuthorizedParty is the base URL of your frontend.
                       if (string.IsNullOrEmpty(azp) || azp.Equals(builder.Configuration["Clerk:AuthorizedParty"]) is false)
                       {
                           context.Fail("AZP Claim is invalid or missing");
                       }

                       return Task.CompletedTask;
                   }
               };
           });
    }
}
