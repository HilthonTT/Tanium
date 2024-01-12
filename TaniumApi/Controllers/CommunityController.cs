﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaniumApi.Authentication.Interfaces;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;
using TaniumApi.Models;

namespace TaniumApi.Controllers;
[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CommunityController(
    ICommunityData communityData,
    IAuthService authService,
    ILogger<CommunityController> logger) : ControllerBase
{
    private readonly ICommunityData _communityData = communityData;
    private readonly IAuthService _authService = authService;
    private readonly ILogger<CommunityController> _logger = logger;

    [HttpGet]
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

	[HttpPost]
	[AllowAnonymous]
	public async Task<IActionResult> CreateCommunityAsync(CreateCommunityModel body)
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

            var data = new CommunityModel()
			{
				UserId = loggedInUser.Id,
				Name = body.Name,
				Description = body.Description,
			};

			var createdCommunity = await _communityData.CreateCommunityAsync(data);

			return Ok(createdCommunity);
		}
		catch (Exception ex)
		{
            _logger.LogError("[COMMUNITY_CONTROLLER_POST]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
	}

	[HttpPatch]
	public async Task<IActionResult> UpdateCommunityAsync(UpdateCommunityModel body)
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
			};

            var createdCommunity = await _communityData.CreateCommunityAsync(data);

			return Ok(createdCommunity);
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

			await _communityData.DeleteCommunityAsync(id);
			return Ok("Success!");
		}
		catch (Exception ex)
		{
            _logger.LogError("[COMMUNITY_CONTROLLER_DELETE]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
	}
}
