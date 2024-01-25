using Microsoft.Extensions.Diagnostics.HealthChecks;
using TaniumApi.Library.Cache.Interfaces;

namespace TaniumApi.Heath;

public class RedisHealthCheck(IRedisCache redisCache, ILogger<RedisHealthCheck> logger) : IHealthCheck
{
    private const int TimeoutDelay = 10000; // 10 seconds
    private readonly IRedisCache _redisCache = redisCache;
    private readonly ILogger<RedisHealthCheck> _logger = logger;

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var checkHealthTask = _redisCache.CheckHealthAsync();

            var completedTask = await Task.WhenAny(checkHealthTask, Task.Delay(TimeoutDelay, cancellationToken));
            if (completedTask == checkHealthTask)
            {
                return HealthCheckResult.Healthy("Redis Database is responding");
            }
     
            _logger.LogWarning("[REDIS_DATABASE]: Timeout occurred while checking health");
            return HealthCheckResult.Degraded("Redis Database health check timed out");
        }
        catch (Exception ex)
        {
            _logger.LogError("[REDIS_DATABASE]: {error}", ex.Message);
            return HealthCheckResult.Unhealthy("Redis Database is not responding");
        }
    }
}
