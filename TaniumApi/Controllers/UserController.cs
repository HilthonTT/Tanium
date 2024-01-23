using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Svix;
using System.Net;
using TaniumApi.Authentication.Interfaces;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;
using TaniumApi.Models;

namespace TaniumApi.Controllers;
[Route("api/[controller]")]
[ApiController]
[EnableRateLimiting("fixed")]
public class UserController(
    IUserData userData,
    IAuthService authService,
    IConfiguration config,
    ILogger<UserController> logger) : ControllerBase
{
    private readonly IUserData _userData = userData;
    private readonly IAuthService _authService = authService;
    private readonly IConfiguration _config = config;
    private readonly ILogger<UserController> _logger = logger;

    [HttpGet]
    [EnableCors("AllowSpecificOrigin")]
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

    [HttpGet("/search/{query}")]
    [EnableCors("AllowSpecificOrigin")]
    public async Task<IActionResult> SearchUsersAsync(string query)
    {
        try
        {
            var users = await _userData.GetAllUsersAsync();

            var queriedUsers = users.Where(u => u.Username.Contains(
                query, StringComparison.InvariantCultureIgnoreCase)).ToList();

            return Ok(queriedUsers);
        }
        catch (Exception ex)
        {
            _logger.LogError("[USER_CONTROLLER_SEARCH]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("{id}")]
    [EnableCors("AllowSpecificOrigin")]
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
    [EnableCors("AllowSpecificOrigin")]
    [Authorize]
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
    [AllowAnonymous]
    public async Task<IActionResult> CreateUserAsync(CreateUserModel body)
    {
        try
        {
            try
            {
                string svixId = Request.Headers["svix-id"];
                string svixTimestamp = Request.Headers["svis-timestamp"];
                string svixSignature = Request.Headers["svix-signature"];

                using var reader = new StreamReader(Request.Body);
                var svixBody = await reader.ReadToEndAsync();

                var wh = new Webhook(_config["Clerk:WebhookSecret"]);

                var headers = new WebHeaderCollection();
                headers.Set("svix-id", svixId);
                headers.Set("svix-timestamp", svixTimestamp);
                headers.Set("svix-signature", svixSignature);

                wh.Verify(svixBody, headers);
            }
            catch (Exception ex)
            {
                _logger.LogError("[USER_CONTROLLER_POST_WEBHOOK]: {error}", ex.Message);
                return StatusCode(400, "Webhook Error");
            }

            var user = new UserModel()
            {
                ExternalUserId = body.ExternalUserId,
                Username = body.Username,
                EmailAddress = body.EmailAddress,
                FirstName = body.FirstName,
                LastName = body.LastName,
                ImageUrl = body.ImageUrl,
            };

            var createdUser = await _userData.CreateUserAsync(user);

            return Ok(createdUser); 
        }
        catch (Exception ex)
        {
            _logger.LogError("[USER_CONTROLLER_POST]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpPatch]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateUserAsync(UpdateUserModel body)
    {
        try
        {
            try
            {
                string svixId = Request.Headers["svix-id"];
                string svixTimestamp = Request.Headers["svis-timestamp"];
                string svixSignature = Request.Headers["svix-signature"];

                using var reader = new StreamReader(Request.Body);
                var svixBody = await reader.ReadToEndAsync();

                var wh = new Webhook(_config["Clerk:WebhookSecret"]);

                var headers = new WebHeaderCollection();
                headers.Set("svix-id", svixId);
                headers.Set("svix-timestamp", svixTimestamp);
                headers.Set("svix-signature", svixSignature);

                wh.Verify(svixBody, headers);
            }
            catch (Exception ex)
            {
                _logger.LogError("[USER_CONTROLLER_PATCH_WEBHOOK]: {error}", ex.Message);
                return StatusCode(400, "Webhook Error");
            }

            var fetchedUser = await _userData.GetUserByExternalUserIdAsync(body.ExternalUserId);
            if (fetchedUser is null)
            {
                return BadRequest("User not found");
            }

            var data = new UserModel()
            {
                Id = fetchedUser.Id,
                Username = body.Username,
                EmailAddress = body.EmailAddress,
                FirstName = body.FirstName,
                LastName = body.LastName,
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

    [HttpDelete("{externalUserId}")]
    [AllowAnonymous]
    public async Task<IActionResult> DeleteUserAsync(string externalUserId)
    {
        try
        {
            try
            {
                string svixId = Request.Headers["svix-id"];
                string svixTimestamp = Request.Headers["svis-timestamp"];
                string svixSignature = Request.Headers["svix-signature"];

                using var reader = new StreamReader(Request.Body);
                var svixBody = await reader.ReadToEndAsync();

                var wh = new Webhook(_config["Clerk:WebhookSecret"]);

                var headers = new WebHeaderCollection();
                headers.Set("svix-id", svixId);
                headers.Set("svix-timestamp", svixTimestamp);
                headers.Set("svix-signature", svixSignature);

                wh.Verify(svixBody, headers);
            }
            catch (Exception ex)
            {
                _logger.LogError("[USER_CONTROLLER_DELETE_WEBHOOK]: {error}", ex.Message);
                return StatusCode(400, "Webhook Error");
            }

            var user = await _userData.GetUserByExternalUserIdAsync(externalUserId);
            if (user is null)
            {
                return BadRequest("User not found");
            }

            await _userData.DeleteUserByExternalUserIdAsync(user);

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError("[USER_CONTROLLER_DELETE]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }
}
