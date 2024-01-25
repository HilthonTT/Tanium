using Microsoft.Extensions.Diagnostics.HealthChecks;
using TaniumApi.Library.DataAccess.Interfaces;

namespace TaniumApi.Heath;

public class DatabaseHealthCheck(ISqlDataAccess sql, ILogger<DatabaseHealthCheck> logger) : IHealthCheck
{
    private const int TimeoutDelay = 10000; // 10 seconds
    private readonly ISqlDataAccess _sql = sql;
    private readonly ILogger<DatabaseHealthCheck> _logger = logger;

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
		try
		{
            var checkHealthTask = _sql.CheckHealthAsync();

            var completedTask = await Task.WhenAny(checkHealthTask, Task.Delay(TimeoutDelay, cancellationToken));
			if (completedTask == checkHealthTask)
			{
				return HealthCheckResult.Healthy("SQL Database is responding");
			}

            _logger.LogWarning("[SQL_DATABASE]: Timeout occurred while checking health");
            return HealthCheckResult.Degraded("SQL Database health check timed out");
        }
		catch (Exception ex)
		{
			_logger.LogError("[SQL_DATABASE]: {error}", ex.Message);
			return HealthCheckResult.Unhealthy("SQL Database is not responding");
		}
    }
}
