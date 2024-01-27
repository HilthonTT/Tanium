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
[EnableCors("AllowSpecificOrigin")]
[EnableRateLimiting("fixed")]
[OutputCache(PolicyName = "Default")]
public class MemberController(
    IMemberData memberData,
    ICommunityData communityData,
    IAuthService authService,
    ILogger<MemberController> logger) : ControllerBase
{
    private readonly IMemberData _memberData = memberData;
    private readonly ICommunityData _communityData = communityData;
    private readonly IAuthService _authService = authService;
    private readonly ILogger<MemberController> _logger = logger;

    [HttpGet("community/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllCommunityMembersAsync(int id)
    {
        try
        {
            var community = await _communityData.GetCommunityAsync(id);
            if (community is null)
            {
                return BadRequest("Community not found");
            }

            var members = await _memberData.GetAllMemberByCommunityIdAsync(id);

            return Ok(members);
        }
        catch (Exception ex)
        {
            _logger.LogError("[MEMBER_CONTROLLER_COMMUNITY_GET]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("isMember/{communityId}")]
    public async Task<IActionResult> IsMemberAsync(int communityId)
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

            bool isMember = await _memberData.IsMemberAsync(loggedInUser.Id, community.Id);

            return Ok(isMember);
        }
        catch (Exception ex)
        {
            _logger.LogError("[MEMBER_CONTROLLER_IS_MEMBER]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateMemberAsync([FromBody] CreateMemberModel body)
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

            var data = new MemberModel()
            {
                UserId = loggedInUser.Id,
                CommunityId = community.Id,
            };

            var createdMember = await _memberData.CreateMemberAsync(data);

            return Ok(createdMember);
        }
        catch (Exception ex)
        {
            _logger.LogError("[MEMBER_CONTROLLER_POST]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMemberAsync(int id)
    {
        try
        {
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            var member = await _memberData.GetMemberByIdAsync(id);
            if (member is null)
            {
                return BadRequest("Member not found");
            }

            var community = await _communityData.GetCommunityAsync(member.CommunityId);
            if (community is null)
            {
                return BadRequest("Community not found");
            }

            if (loggedInUser.Id == member.UserId)
            {
                return BadRequest("You cannot ban yourself");
            }

            bool isCommunityOwner = community.UserId == loggedInUser.Id;
            bool isFetchedMember = member.UserId == loggedInUser.Id;

            if (isCommunityOwner is false && isFetchedMember is false)
            {
                return StatusCode(401, "Unauthorized");
            }

            await _memberData.DeleteMemberAsync(member);

            return Ok(member);
        }
        catch (Exception ex)
        {
            _logger.LogError("[MEMBER_CONTROLLER_DELETE]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }
}
