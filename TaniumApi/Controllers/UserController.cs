using Microsoft.AspNetCore.Mvc;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;
using TaniumApi.Models;

namespace TaniumApi.Controllers;
[Route("api/[controller]")]
[ApiController]
public class UserController(IUserData userData, ILogger<UserController> logger) : ControllerBase
{
    private readonly IUserData _userData = userData;
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

    [HttpGet("auth")]
    public async Task<IActionResult> GetUserAuthAsync()
    {
        try
        {
            // TODO Check for clerk user ID

            return Ok(null);
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
    public async Task<IActionResult> UpdateUserAsync(UpdateUserModel body)
    {
        try
        {
            if (ModelState.IsValid is false)
            {
                return BadRequest(ModelState);
            }

            var data = new UserModel()
            {
                Id = body.Id,
                Username = body.Username,
                FirstName = body.FirstName,
                LastName = body.LastName,
                EmailAddress = body.EmailAddress,
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
