using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
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
[OutputCache(PolicyName = "Default")]
public class BanController(
    IBanData banData,
    ICommunityData communityData,
    IUserData userData,
    IAuthService authService,
    ILogger<BanController> logger) : ControllerBase
{
    private readonly IBanData _banData = banData;
    private readonly ICommunityData _communityData = communityData;
    private readonly IUserData _userData = userData;
    private readonly IAuthService _authService = authService;
    private readonly ILogger<BanController> _logger = logger;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBanAsync(int id)
    {
        try
        {
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            var ban = await _banData.GetBanAsync(id);
            if (ban is null)
            {
                return BadRequest("Ban not found");
            }

            var community = await _communityData.GetCommunityAsync(ban.CommunityId);
            if (community is null)
            {
                return BadRequest("Community not found");
            }

            bool isOwner = community?.UserId != loggedInUser.Id;
            if (isOwner is false)
            {
                return StatusCode(401, "Unauthorized to view the ban");
            }

            return Ok(ban);
        }
        catch (Exception ex)
        {
            _logger.LogError("[BAN_CONTROLLER_GET]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("community/{communityId}")]
    public async Task<IActionResult> GetCommunityBansAsync(int communityId)
    {
        try
        {
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            var community = await _communityData.GetCommunityAsync(communityId);
            if (community is null)
            {
                return BadRequest("Community not found");
            }

            if (community.UserId != loggedInUser.Id)
            {
                return StatusCode(401, "Unauthorized to view the bans");
            }

            var bans = await _banData.GetCommunityBansAsync(communityId);

            return Ok(bans);
        }
        catch (Exception ex)
        {
            _logger.LogError("[BAN_CONTROLLER_COMMUNITY_GET]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("community/{communityId}/search/{query}")]
    public async Task<IActionResult> SearchCommunityBansAsync(int communityId, string query)
    {
        try
        {
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            var community = await _communityData.GetCommunityAsync(communityId);
            if (community is null)
            {
                return BadRequest("Community not found");
            }

            if (community.UserId != loggedInUser.Id)
            {
                return StatusCode(401, "Unauthorized to view the bans");
            }

            var bans = await _banData.GetCommunityBansAsync(communityId);

            var queriedBans = bans.Where(b => b.BannedUser.Username.Contains(
                query, StringComparison.InvariantCultureIgnoreCase));

            return Ok(queriedBans);
        }
        catch (Exception ex)
        {
            _logger.LogError("[BAN_CONTROLLER_COMMUNITY_GET]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("isBanned/{communityId}")]
    public async Task<IActionResult> IsBannedAsync(int communityId)
    {
        try
        {
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            var community = await _communityData.GetCommunityAsync(communityId);
            if (community is null)
            {
                return BadRequest("Community not found");
            }

            bool isBanned = await _banData.IsBannedAsync(loggedInUser.Id, communityId);
            
            return Ok(isBanned);
        }
        catch (Exception ex)
        {
            _logger.LogError("[BAN_CONTROLLER_IS_BANNED]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateBanAsync([FromBody] CreateBanModel body)
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

            var community = await _communityData.GetCommunityAsync(body.CommunityId);
            if (community is null)
            {
                return BadRequest("Community not found");
            }

            bool isOwner = community.UserId == loggedInUser.Id;
            if (isOwner is false)
            {
                return StatusCode(401, "Unauthorized");
            }

            var bannedUser = await _userData.GetUserAsync(body.BannedUserId);
            if (bannedUser is null)
            {
                return BadRequest("User to ban not found");
            }

            var data = new BanModel()
            {
                BannerUserId = loggedInUser.Id,
                BannedUserId = bannedUser.Id,
                CommunityId = community.Id,
                Reason = body.Reason,
            };

            var createdBan = await _banData.CreateBanAsync(data);

            return Ok(createdBan);
        }
        catch (Exception ex)
        {
            _logger.LogError("[BAN_CONTROLLER_POST]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBanAsync(int id)
    {
        try
        {
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            var ban = await _banData.GetBanAsync(id);
            if (ban is null)
            {
                return BadRequest("Ban not found");
            }

            var community = await _communityData.GetCommunityAsync(ban.CommunityId);
            if (community is null)
            {
                return BadRequest("Community not found");
            }

            bool isOwner = community?.UserId == loggedInUser.Id;
            if (isOwner is false)
            {
                return StatusCode(401, "Unauthorized");
            }

            await _banData.DeleteBanAsync(id);

            return Ok("Success!");
        }
        catch (Exception ex)
        {
            _logger.LogError("[BAN_CONTROLLER_DELETE: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }
}
