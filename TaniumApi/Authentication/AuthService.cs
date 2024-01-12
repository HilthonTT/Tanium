using Clerk.Net.Client;
using TaniumApi.Authentication.Interfaces;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Authentication;

public class AuthService(IUserData userData, ClerkApiClient client) : IAuthService
{
    private const string NameIdentifierClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
    private readonly IUserData _userData = userData;
    private readonly ClerkApiClient _client = client;

    public async Task<UserModel?> GetUserFromAuthAsync(HttpContext context)
    {
        var claims = context.User.Claims;

        string userId = claims.FirstOrDefault(x => x.Type.Contains(NameIdentifierClaim,
            StringComparison.InvariantCultureIgnoreCase))?.Value;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return null;
        }

        var authenticatedUser = await _userData.GetUserByExternalUserIdAsync(userId);
        if (authenticatedUser is not null)
        {
            return authenticatedUser;
        }

        var users = await _client.Users.GetAsync();
        var user = users.FirstOrDefault(x => x.Id == userId);
        if (user is null)
        {
            return null;
        }

        var data = new UserModel()
        {
            ExternalUserId = userId,
            Username = user?.Username,
            FirstName = user?.FirstName,
            LastName = user?.LastName,
            EmailAddress = user?.EmailAddresses.FirstOrDefault().EmailAddressProp,
        };

        var createdUser = await _userData.CreateUserAsync(data);

        return createdUser;
    }
}
