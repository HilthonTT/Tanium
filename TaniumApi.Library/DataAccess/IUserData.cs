using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public interface IUserData
{
    Task<UserModel> CreateUserAsync(UserModel user);
    Task DeleteUserAsync(int id);
    Task<List<UserModel>> GetAllUsersAsync();
    Task<UserModel> GetUserByExternalUserIdAsync(string externalUserId);
    Task<UserModel> GetUserByIdAsync(int id);
    Task<UserModel> UpdateUserAsync(UserModel user);
}