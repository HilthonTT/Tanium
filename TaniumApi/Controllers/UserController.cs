using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Svix;
using System.Net;
using TaniumApi.Authentication.Interfaces;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;
using TaniumApi.Models;

namespace TaniumApi.Controllers;
[Route("api/[controller]")]
[ApiController]
[EnableCors("AllowSpecificOrigin")]
[AllowAnonymous]
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
    public async Task<IActionResult> HandleUserAsync(WebhookModel body)
    {
        try
        {
            string svixId = Request.Headers["svix-id"];
            string svixTimestamp = Request.Headers["svis-timestamp"];
            string svixSignature = Request.Headers["svix-signature"];

            if (string.IsNullOrEmpty(svixId) || string.IsNullOrEmpty(svixTimestamp) || string.IsNullOrEmpty(svixSignature))
            {
                return BadRequest("Error occured -- no svix headers");
            }

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
            _logger.LogError("[WEBHOOK_ERROR]: {error}", ex.Message);
            return StatusCode(400, "Internal Error");
        }

        if (body.Type == "user.created")
        {
            try
            {
                if (ModelState.IsValid is false)
                {
                    return BadRequest(ModelState);
                }

                var data = new UserModel()
                {
                    ExternalUserId = body.Data.Id,
                    Username = body.Data.Username,
                    FirstName = body.Data.FirstName,
                    LastName = body.Data.LastName,
                    EmailAddress = body.Data.EmailAddress,
                    ImageUrl = body.Data.ImageUrl,
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
        else if (body.Type == "user.updated")
        {
            var data = new UserModel()
            {
                Username = body.Data.Username,
                FirstName = body.Data.FirstName,
                LastName = body.Data.LastName,
                EmailAddress = body.Data.EmailAddress,
                ImageUrl = body.Data.ImageUrl,
            };

            var updatedUser = await _userData.UpdateUserAsync(data);
            return Ok(updatedUser);
        }
        else if (body.Type == "user.deleted")
        {
            await _userData.DeleteUserByExternalUserIdAsync(body.Data.Id);
            return Ok("Success!");
        }

        return Ok();
    }
}
