using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaniumApi.Authentication.Interfaces;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;
using TaniumApi.Models;

namespace TaniumApi.Controllers;
[Route("api/[controller]")]
[ApiController]
public class UserController(
    IUserData userData,
    IAuthService authService,
    ILogger<UserController> logger) : ControllerBase
{
    private readonly IUserData _userData = userData;
    private readonly IAuthService _authService = authService;
    private readonly ILogger<UserController> _logger = logger;

    [HttpGet]
    public async Task<IActionResult> GetAllUsersAsync()
    {
        try
        {
            var users = await _userData.GetAllUsersAsync();
            
            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError("[USER_CONTROLLER_ALL]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserAsync(int id)
    {
        try
        {
            var user = await _userData.GetUserByIdAsync(id);
            if (user is null)
            {
                return NotFound("User not found");
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError("[USER_CONTROLLER_ID]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("auth")]
    public async Task<IActionResult> GetUserAuthAsync()
    {
        try
        {
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return NotFound("User not found");
            }

            return Ok(loggedInUser);
        }
        catch (Exception ex)
        {
            _logger.LogError("[USER_CONTROLLER_AUTH]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateUserAsync(CreateUserModel body)
    {
        try
        {
            if (ModelState.IsValid is false)
            {
                return BadRequest(ModelState);
            }

            var data = new UserModel()
            {
                ExternalUserId = body.ExternalUserId,
                Username = body.Username,
                FirstName = body.FirstName,
                LastName = body.LastName,
                EmailAddress = body.EmailAddress,
                ImageUrl = body.ImageUrl,
            };

            var createdUser = await _userData.CreateUserAsync(data);

            return Ok(createdUser);
        }
        catch (Exception ex)
        {
            _logger.LogError("[USER_CONTROLLER_POST]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpPatch]
    [Authorize]
    public async Task<IActionResult> UpdateUserAsync(UpdateUserModel body)
    {
        try
        {
            if (ModelState.IsValid is false)
            {
                return BadRequest(ModelState);
            }

            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            var data = new UserModel()
            {
                Id = body.Id,
                Username = body.Username,
                FirstName = body.FirstName,
                LastName = body.LastName,
                EmailAddress = body.EmailAddress,
                ImageUrl = body.ImageUrl,
            };

            var updatedUser = await _userData.UpdateUserAsync(data);
            return Ok(updatedUser);
        }
        catch (Exception ex)
        {
            _logger.LogError("[USER_CONTROLLER_PATCH]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUserAsync(int id)
    {
        try
        {
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            if (id != loggedInUser.Id)
            {
                return StatusCode(401, "Unauthorized");
            }

            await _userData.DeleteUserAsync(id);

            return Ok("User Deleted!");
        }
        catch (Exception ex)
        {
            _logger.LogError("[USER_CONTROLLER_DELETE]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }
}
