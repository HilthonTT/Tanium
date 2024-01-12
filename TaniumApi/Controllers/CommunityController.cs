using Microsoft.AspNetCore.Mvc;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;
using TaniumApi.Models;

namespace TaniumApi.Controllers;
[Route("api/[controller]")]
[ApiController]
public class CommunityController(ICommunityData communityData, ILogger<CommunityController> logger) : ControllerBase
{
    private readonly ICommunityData _communityData = communityData;
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
	public async Task<IActionResult> CreateCommunityAsync(CreateCommunityModel body)
	{
		try
		{
			if (ModelState.IsValid is false)
			{
				return BadRequest(ModelState);
			}

			// TODO: Add user auth

			var community = new CommunityModel()
			{

			};

			var createdCommunity = await _communityData.CreateCommunityAsync(community);

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

			var community = new CommunityModel()
			{
				Id = body.Id,
				Name = body.Name,
				Description = body.Description,
			};

            var createdCommunity = await _communityData.CreateCommunityAsync(community);

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
