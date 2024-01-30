using Dapper;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public class UserSettingsData(ISqlDataAccess sql) : IUserSettingsData
{
    private readonly ISqlDataAccess _sql = sql;

    private async Task<UserSettingsModel> CreateUserSettingsAsync(int userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);

        var output = await _sql.SaveDataAsync<UserSettingsModel>("dbo.spUserSettings_Insert", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", userId);
        var user = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);

        output.User = user;

        return output;
    }

    public async Task<UserSettingsModel> GetUserSettingsAsync(int userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);

        var output = await _sql.GetDataAsync<UserSettingsModel>("dbo.spUserSettings_GetByUserId", parameters);
        output ??= await CreateUserSettingsAsync(userId);

        if (output?.User is not null)
        {
            return output;
        }

        parameters = new DynamicParameters();
        parameters.Add("Id", userId);
        var user = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);

        output.User = user;

        return output;
    }

    public async Task<UserSettingsModel> UpdateSettingsAsync(UserSettingsModel settings)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", settings.UserId);
        parameters.Add("IsProfilePublic", settings.IsProfilePublic);

        var output = await _sql.SaveDataAsync<UserSettingsModel>("dbo.spUserSettings_Update", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", settings.UserId);
        var user = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);

        output.User = user;

        return output;
    }
}
