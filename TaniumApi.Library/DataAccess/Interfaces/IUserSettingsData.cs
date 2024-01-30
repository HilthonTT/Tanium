using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess.Interfaces;
public interface IUserSettingsData
{
    Task<UserSettingsModel> GetUserSettingsAsync(int userId);
    Task<UserSettingsModel> UpdateSettingsAsync(UserSettingsModel settings);
}