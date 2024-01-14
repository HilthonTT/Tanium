using Dapper;
using Microsoft.Extensions.Caching.Memory;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public class UserData(ISqlDataAccess sql, IMemoryCache cache) : IUserData
{
    private const string CacheName = nameof(UserData);
    private readonly ISqlDataAccess _sql = sql;
    private readonly IMemoryCache _cache = cache;

    public async Task<List<UserModel>> GetAllUsersAsync()
    {
        var output = _cache.Get<List<UserModel>>(CacheName);
        if (output is not null)
        {
            return output;
        }

        output = await _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll");
        _cache.Set(CacheName, output, TimeSpan.FromMinutes(30));

        return output;
    }

    public async Task<UserModel> GetUserByIdAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        var output = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);

        return output;
    }

    public async Task<UserModel> GetUserByExternalUserIdAsync(string externalUserId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("ExternalUserId", externalUserId);

        var output = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetByExternalUserId", parameters);

        return output;
    }

    public async Task<UserModel> CreateUserAsync(UserModel user)
    {
        var parameters = new DynamicParameters();
        parameters.Add("ExternalUserId", user.ExternalUserId);
        parameters.Add("Username", user.Username);
        parameters.Add("EmailAddress", user.EmailAddress);
        parameters.Add("FirstName", user.FirstName);
        parameters.Add("LastName", user.LastName);
        parameters.Add("ImageUrl", user.ImageUrl);

        var output = await _sql.SaveDataAsync<UserModel>("dbo.spUser_Insert", parameters);

        return output;
    }

    public async Task<UserModel> UpdateUserAsync(UserModel user)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", user.Id);
        parameters.Add("Username", user.Username);
        parameters.Add("EmailAddress", user.EmailAddress);
        parameters.Add("FirstName", user.FirstName);
        parameters.Add("LastName", user.LastName);
        parameters.Add("ImageUrl", user.ImageUrl);

        var output = await _sql.SaveDataAsync<UserModel>("dbo.spUser_Update", parameters);

        return output;
    }

    public async Task DeleteUserAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        await _sql.SaveDataAsync<UserModel>("dbo.spUser_Delete", parameters);
    }
}
