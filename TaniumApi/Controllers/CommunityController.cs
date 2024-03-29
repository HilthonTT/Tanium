﻿using Microsoft.AspNetCore.Authorization;
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
[EnableCors]
public class CommunityController(
    ICommunityData communityData,
	IMemberData memberData,
	ISubscriptionData subscriptionData,
    IAuthService authService,
    ILogger<CommunityController> logger) : ControllerBase
{
    private readonly ICommunityData _communityData = communityData;
    private readonly IMemberData _memberData = memberData;
    private readonly ISubscriptionData _subscriptionData = subscriptionData;
    private readonly IAuthService _authService = authService;
    private readonly ILogger<CommunityController> _logger = logger;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllCommunitiesAsync()
    {
		try
		{
            var communities = await _communityData.GetAllCommunitiesAsync();

			return Ok(communities);
		}
		catch (Exception ex)
		{
			_logger.LogError("[COMMUNITY_CONTROLLER_ALL]: {error}", ex.Message);
			return StatusCode(500, "Internal Error");
		}
    }

	[HttpGet("search/{query}")]
	[AllowAnonymous]
    public async Task<IActionResult> SearchCommunitiesAsync(string query)
	{
		try
		{
			var communities = await _communityData.GetAllCommunitiesAsync();

			var queriedCommunities = communities.Where(
				c => c.Name.Contains(query, StringComparison.InvariantCultureIgnoreCase) ||
				c.Description.Contains(query, StringComparison.InvariantCultureIgnoreCase)).ToList();

			return Ok(queriedCommunities);
		}
		catch (Exception ex)
		{
            _logger.LogError("[COMMUNITY_CONTROLLER_SEARCH]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
	}

	[HttpGet("{id}")]
	[AllowAnonymous]
    public async Task<IActionResult> GetCommunityAsync(int id)
	{
		try
		{
			var community = await _communityData.GetCommunityAsync(id);
			if (community is null)
			{
				return NotFound();
			}

			return Ok(community);
		}
		catch (Exception ex)
		{
            _logger.LogError("[COMMUNITY_CONTROLLER_ID]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
	}

	[HttpGet("user")]
    public async Task<IActionResult> GetUserCommunitiesAsync()
	{
		try
		{
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

			var userCommunities = await _communityData.GetCommunitiesUserAsync(loggedInUser.Id);

			return Ok(userCommunities);
        }
		catch (Exception ex)
		{
            _logger.LogError("[COMMUNITY_CONTROLLER_USER]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
	}

	[HttpGet("IsAllowedToCreate")]
	public async Task<IActionResult> IsAllowedToCreateCommunitiesAsync()
	{
		try
		{
			var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
			if (loggedInUser is null)
			{
				return StatusCode(401, "Unauthorized");
			}
			
			bool isPro = await _subscriptionData.IsValidAsync(loggedInUser.Id);
            int createdCommunityCount = await _communityData.GetCreatedCommunityCountAsync(loggedInUser.Id);

            if (createdCommunityCount > 10 && isPro is false)
            {
				return Ok(false);
            }

			return Ok(true);
        }
		catch (Exception ex)
		{
			_logger.LogError("[COMMUNITY_CONTROLLER_ALLOWED]: {error}", ex.Message);
			return StatusCode(500, "Internal Error");
		}
	}

	[HttpPost]
    public async Task<IActionResult> CreateCommunityAsync([FromBody] CreateCommunityModel body)
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

			bool isPro = await _subscriptionData.IsValidAsync(loggedInUser.Id);
            int createdCommunityCount = await _communityData.GetCreatedCommunityCountAsync(loggedInUser.Id);

			if (createdCommunityCount > 10 && isPro is false)
			{
				return BadRequest("You must have a pro subscription to create more than 10 communities");
			}

			var communityData = new CommunityModel()
			{
				UserId = loggedInUser.Id,
				Name = body.Name,
				Description = body.Description,
				ImageUrl = body.ImageUrl,
				BannerUrl = body.BannerUrl,
			};

			var createdCommunity = await _communityData.CreateCommunityAsync(communityData);

			var memberData = new MemberModel()
			{
				UserId = loggedInUser.Id,
				CommunityId = createdCommunity.Id,
			};

			var userMember = await _memberData.CreateMemberAsync(memberData);

			return Ok(createdCommunity);
		}
		catch (Exception ex)
		{
            _logger.LogError("[COMMUNITY_CONTROLLER_POST]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
	}

	[HttpPatch]
	public async Task<IActionResult> UpdateCommunityAsync([FromBody] UpdateCommunityModel body)
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

			var fetchedCommunity = await _communityData.GetCommunityAsync(body.Id);
			if (fetchedCommunity is null)
			{
				return NotFound();
			}


			if (fetchedCommunity.UserId != loggedInUser.Id)
			{
				return StatusCode(401, "Unauthorized");
			}

            var data = new CommunityModel()
			{
				Id = body.Id,
				Name = body.Name,
				Description = body.Description,
				UserId = loggedInUser.Id,
				ImageUrl = body.ImageUrl,
				BannerUrl = body.BannerUrl,
			};

            var updatedCommunity = await _communityData.UpdateCommunityAsync(data);

			return Ok(updatedCommunity);
        }
		catch (Exception ex)
		{
            _logger.LogError("[COMMUNITY_CONTROLLER_PATCH]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> DeleteCommunityAsync(int id)
	{
		try
		{
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            var community = await _communityData.GetCommunityAsync(id);
			if (community is null)
			{
				return NotFound();
			}

			if (community.UserId != loggedInUser.Id)
			{
                return StatusCode(401, "Unauthorized");
            }

			await _communityData.DeleteCommunityAsync(community);
			
			return Ok("Success!");
		}
		catch (Exception ex)
		{
            _logger.LogError("[COMMUNITY_CONTROLLER_DELETE]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
	}
}
