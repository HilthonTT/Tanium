using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using TaniumApi.Authentication.Interfaces;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;
using TaniumApi.Models;

namespace TaniumApi.Controllers;
[Route("api/[controller]")]
[ApiController]
[Authorize]
[EnableRateLimiting("fixed")]
[EnableCors("AllowSpecificOrigin")]
public class UserSettingsController(
    IUserSettingsData userSettingsData,
    IAuthService authService,
    ILogger<UserSettingsController> logger) : ControllerBase
{
    private readonly IUserSettingsData _userSettingsData = userSettingsData;
    private readonly IAuthService _authService = authService;
    private readonly ILogger<UserSettingsController> _logger = logger;

    [HttpGet("auth")]
    public async Task<IActionResult> GetPersonalSettingsAsync()
    {
        try
        {
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            var settings = await _userSettingsData.GetUserSettingsAsync(loggedInUser.Id);

            return Ok(settings);
        }
        catch (Exception ex)
        {
            _logger.LogError("[USERSETTINGS_CONTROLLER_GET_AUTH]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserSettingsAsync(int userId)
    {
        try
        {
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            var settings = await _userSettingsData.GetUserSettingsAsync(userId);

            return Ok(settings);
        }
        catch (Exception ex)
        {
            _logger.LogError("[USERSETTINGS_CONTROLLER_GET_USER]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpPatch]
    public async Task<IActionResult> UpdateUserSettingsAsync([FromBody] UpdateUserSettingsModel body)
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

            var data = new UserSettingsModel()
            {
                UserId = loggedInUser.Id,
                IsProfilePublic = body.IsProfilePublic,
            };

            var updatedSettings = await _userSettingsData.UpdateSettingsAsync(data);

            return Ok(updatedSettings);
        }
        catch (Exception ex)
        {
            _logger.LogError("[USERSETTINGS_CONTROLLER_PATCH]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }
}
