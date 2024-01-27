using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess.Interfaces;
public interface IUserData
{
    Task<UserModel> CreateUserAsync(UserModel user);
    Task DeleteUserAsync(UserModel user);
    Task DeleteUserByExternalUserIdAsync(UserModel user);
    Task<List<UserModel>> GetAllUsersAsync();
    Task<UserModel> GetUserByExternalUserIdAsync(string externalUserId);
    Task<UserModel> GetUserAsync(int id);
    Task<UserModel> UpdateUserAsync(UserModel user);
    Task<UserModel> UpdateUserByExternalUserIdAsync(UserModel user);
}