using Dapper;
using TaniumApi.Library.Cache.Interfaces;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public class UserData(ISqlDataAccess sql, IRedisCache redisCache) : IUserData
{
    private const string CacheName = nameof(UserData);
    private readonly ISqlDataAccess _sql = sql;
    private readonly IRedisCache _redisCache = redisCache;

    public async Task<List<UserModel>> GetAllUsersAsync()
    {
        var output = await _redisCache.GetRecordAsync<List<UserModel>>(CacheName);
        if (output is not null)
        {
            return output;
        }

        output = await _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll");
        await _redisCache.SetRecordAsync(CacheName, output, TimeSpan.FromMinutes(30));

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

    public async Task<UserModel> UpdateUserByExternalUserIdAsync(UserModel user)
    {
        var parameters = new DynamicParameters();
        parameters.Add("ExternalUserId", user.ExternalUserId);
        parameters.Add("Username", user.Username);
        parameters.Add("EmailAddress", user.EmailAddress);
        parameters.Add("FirstName", user.FirstName);
        parameters.Add("LastName", user.LastName);
        parameters.Add("ImageUrl", user.ImageUrl);

        var output = await _sql.SaveDataAsync<UserModel>("dbo.spUser_UpdateByExternalUserId", parameters);

        return output;
    }

    public async Task DeleteUserAsync(UserModel user)
    {
        try
        {
            _sql.StartTransaction();

            var parameters = new DynamicParameters();
            parameters.Add("UserId", user.Id);

            await _sql.SaveInTransactionAsync<CommunityModel>("dbo.spDeleteCommunity_ByUserId", parameters);
            await _sql.SaveInTransactionAsync<CommunityModel>("dbo.spDeleteCommunity_ByUserId", parameters);
            await _sql.SaveInTransactionAsync<DownvoteModel>("dbo.spDownvote_DeleteByUserId", parameters);
            await _sql.SaveInTransactionAsync<ReplyModel>("dbo.spUpvote_DeleteByUserId", parameters);

            parameters = new DynamicParameters();
            parameters.Add("Id", user.Id);

            await _sql.SaveDataAsync<UserModel>("dbo.spUser_Delete", parameters);

            _sql.CommitTransaction();
        }
        catch (Exception ex)
        {
            _sql.RollbackTransaction();
            throw new Exception(ex.Message);
        }
    }

    public async Task DeleteUserByExternalUserIdAsync(UserModel user)
    {
        try
        {
            _sql.StartTransaction();

            var parameters = new DynamicParameters();
            parameters.Add("UserId", user.Id);

            await _sql.SaveInTransactionAsync<CommunityModel>("dbo.spDeleteCommunity_ByUserId", parameters);
            await _sql.SaveInTransactionAsync<DownvoteModel>("dbo.spDownvote_DeleteByUserId", parameters);
            await _sql.SaveInTransactionAsync<ReplyModel>("dbo.spUpvote_DeleteByUserId", parameters);
            await _sql.SaveInTransactionAsync<BanModel>("dbo.spBan_DeleteByUserId", parameters);

            parameters = new DynamicParameters();
            parameters.Add("ExternalUserId", user.ExternalUserId);

            await _sql.SaveInTransactionAsync<UserModel>("dbo.spUser_DeleteByExternalUserId", parameters);

            _sql.CommitTransaction();
        }
        catch (Exception ex)
        {
            _sql.RollbackTransaction();
            throw new Exception(ex.Message);
        }
    }
}
