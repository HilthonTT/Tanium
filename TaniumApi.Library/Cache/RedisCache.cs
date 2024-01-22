using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using TaniumApi.Library.Cache.Interfaces;

namespace TaniumApi.Library.Cache;
public class RedisCache(
    IDistributedCache redisCache) : IRedisCache
{
    private readonly IDistributedCache _redisCache = redisCache;

    public async Task SetRecordAsync<T>(
        string recordId, T data,
        TimeSpan? absoluteExpireTime = null,
        TimeSpan? unusedExpireTime = null)
    {
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = absoluteExpireTime ?? TimeSpan.FromMinutes(30),
            SlidingExpiration = unusedExpireTime
        };

        string jsonData = JsonSerializer.Serialize(data);
        await _redisCache.SetStringAsync(recordId, jsonData, options);
    }

    public async Task<T> GetRecordAsync<T>(string recordId)
    {
        string jsonData = await _redisCache.GetStringAsync(recordId);

        if (string.IsNullOrWhiteSpace(jsonData))
        {
            return default;
        }

        return JsonSerializer.Deserialize<T>(jsonData);
    }

    public async Task RemoveAsync(string recordId)
    {
        await _redisCache.RemoveAsync(recordId);
    }
}
