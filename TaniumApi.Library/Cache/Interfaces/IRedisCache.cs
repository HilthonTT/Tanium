namespace TaniumApi.Library.Cache.Interfaces;

public interface IRedisCache
{
    Task<T> GetRecordAsync<T>(string recordId);
    Task RemoveAsync(string recordId);
    Task SetRecordAsync<T>(string recordId, T data, TimeSpan? absoluteExpireTime = null, TimeSpan? unusedExpireTime = null);
}