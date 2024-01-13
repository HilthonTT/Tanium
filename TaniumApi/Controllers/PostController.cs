using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaniumApi.Authentication.Interfaces;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;
using TaniumApi.Models;

namespace TaniumApi.Controllers;
[Route("api/[controller]")]
[ApiController]
[Authorize]
public class PostController(
    IPostData postData,
    ICommunityData communityData,
    IAuthService authService,
    ILogger<PostController> logger) : ControllerBase
{
    private readonly IPostData _postData = postData;
    private readonly ICommunityData _communityData = communityData;
    private readonly IAuthService _authService = authService;
    private readonly ILogger<PostController> _logger = logger;

    [HttpGet("community/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllPostsAsync(int id)
    {
        try
        {
            var community = await _communityData.GetCommunityAsync(id);
            if (community is null)
            {
                return BadRequest("Community is not found");
            }

            var posts = await _postData.GetPostsByCommunityIdAsync(id);

            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError("[POST_CONTROLLER_GET_ALL]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPostByIdAsync(int id)
    {
        try
        {
            var post = await _postData.GetPostByIdAsync(id);
            if (post is null)
            {
                return NotFound("Post is not found");
            }

            return Ok(post);
        }
        catch (Exception ex)
        {
            _logger.LogError("[POST_CONTROLLER_GET]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreatePostAsync(CreatePostModel body)
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
                return BadRequest("Community is not found");
            }

            var data = new PostModel()
            {
                Title = body.Title,
                UserId = loggedInUser.Id,
                Description = body.Description,
                CommunityId = body.CommunityId,
                ImageUrl = body.ImageUrl,
            };

            var createdPost = await _postData.CreatePostAsync(data);

            return Ok(createdPost);
        }
        catch (Exception ex)
        {
            _logger.LogError("[POST_CONTROLLER_POST]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpPatch]
    public async Task<IActionResult> UpdatePostAsync(UpdatePostModel body)
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


            var post = await _postData.GetPostByIdAsync(body.Id);
            if (post is null)
            {
                return NotFound("Post not found");
            }

            if (post.UserId != loggedInUser.Id)
            {
                return StatusCode(401, "Unauthorized");
            }

            var data = new PostModel()
            {
                Id = body.Id,
                Title = body.Title,
                Description = body.Description,
                ImageUrl = body.ImageUrl,
            };

            var updatedPost = await _postData.UpdatePostAsync(data);

            return Ok(updatedPost);
        }
        catch (Exception ex)
        {
            _logger.LogError("[POST_CONTROLLER_PATCH]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePostAsync(int id)
    {
        try
        {
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            var post = await _postData.GetPostByIdAsync(id);
            if (post.UserId != loggedInUser.Id)
            {
                return StatusCode(401, "Unauthorized");
            }

            await _postData.DeletePostAsync(id);

            return Ok(post);
        }
        catch (Exception ex)
        {
            _logger.LogError("[POST_CONTROLLER_PATCH]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }
}
