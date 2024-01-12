using TaniumApi.Library.Models;

namespace TaniumApi.Authentication.Interfaces;
public interface IAuthService
{
    Task<UserModel> GetUserFromAuthAsync(HttpContext context);
}