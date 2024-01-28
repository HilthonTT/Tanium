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
public class PostController(
    IPostData postData,
    ICommunityData communityData,
    IUserData userData,
    IAuthService authService,
    IMemberData memberData,
    IBanData banData,
    ILogger<PostController> logger) : ControllerBase
{
    private readonly IPostData _postData = postData;
    private readonly ICommunityData _communityData = communityData;
    private readonly IUserData _userData = userData;
    private readonly IAuthService _authService = authService;
    private readonly IMemberData _memberData = memberData;
    private readonly IBanData _banData = banData;
    private readonly ILogger<PostController> _logger = logger;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllPostsAsync()
    {
        try
        {
            var posts = await _postData.GetAllPostsAsync();

            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError("[POST_CONTROLLER_GET_ALL]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("best")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllBestPostsAsync()
    {
        try
        {
            var posts = await _postData.GetAllPostsAsync();

            posts = [.. posts.OrderByDescending(p => p.Upvotes.Count - p.Downvotes.Count)];

            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError("[POST_CONTROLLER_GET_BEST]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("hot")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllHotPostsAsync()
    {
        try
        {
            DateTime startDateOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek);
            DateTime endDateOfWeek = startDateOfWeek.AddDays(7);

            var posts = await _postData.GetAllPostsAsync();

            posts =
            [
                .. posts
                    .Where(p => p.DateCreated >= startDateOfWeek && p.DateCreated <= endDateOfWeek)
                    .OrderByDescending(p => p.Upvotes.Count),
            ];

            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError("[POST_CONTROLLER_GET_HOT]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("community/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllCommunityPostsAsync(int id)
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
            _logger.LogError("[POST_CONTROLLER_GET_COMMUNITY_ALL]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("community/best/{communityId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllBestPostsAsync(int communityId)
    {
        try
        {
            var community = await _communityData.GetCommunityAsync(communityId);
            if (community is null)
            {
                return BadRequest("Community not found");
            }

            var posts = await _postData.GetPostsByCommunityIdAsync(communityId);

            posts = [.. posts.OrderByDescending(p => p.Upvotes.Count - p.Downvotes.Count)];

            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError("[POST_CONTROLLER_GET_BEST]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("community/hot/{communityId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCommunityHotPostsAsync(int communityId)
    {
        try
        {
            var community = await _communityData.GetCommunityAsync(communityId);
            if (community is null)
            {
                return BadRequest("Community not found");
            }

            DateTime startDateOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek);
            DateTime endDateOfWeek = startDateOfWeek.AddDays(7);

            var posts = await _postData.GetPostsByCommunityIdAsync(communityId);

            posts =
            [
                .. posts
                    .Where(p => p.DateCreated >= startDateOfWeek && p.DateCreated <= endDateOfWeek)
                    .OrderByDescending(p => p.Upvotes.Count),
            ];

            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError("[POST_CONTROLLER_GET_HOT]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("search/{query}")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchPostsAsync(string query)
    {
        try
        {
            var posts = await _postData.GetAllPostsAsync();

            var queriedPosts = posts.Where(p => p.Title.Contains(query, StringComparison.InvariantCultureIgnoreCase) ||
                p.Description.Contains(query, StringComparison.InvariantCultureIgnoreCase)).ToList();

            return Ok(queriedPosts);
        }
        catch (Exception ex)
        {
            _logger.LogError("[POST_CONTROLLER_SEARCH]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("user/{userId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetUserPostsAsync(int userId)
    {
        try
        {
            var user = await _userData.GetUserAsync(userId);
            if (user is null)
            {
                return BadRequest("User not found");
            }

            var posts = await _postData.GetUserPostsAsync(userId);

            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError("[POST_CONTROLLER_USER]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("user/{userId}/upvoted")]
    [AllowAnonymous]
    public async Task<IActionResult> GetUserUpvotedAsync(int userId)
    {
        try
        {
            var user = await _userData.GetUserAsync(userId);
            if (user is null)
            {
                return BadRequest("User not found");
            }

            var posts = await _postData.GetUpvotedPostsAsync(userId);

            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError("[POST_CONTROLLER_USER_UPVOTED]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpGet("user/{userId}/downvoted")]
    [AllowAnonymous]
    public async Task<IActionResult> GetUserDownvotedAsync(int userId)
    {
        try
        {
            var user = await _userData.GetUserAsync(userId);
            if (user is null)
            {
                return BadRequest("User not found");
            }

            var posts = await _postData.GetDownvotedPostsAsync(userId);

            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError("[POST_CONTROLLER_USER_DOWNVOTED]: {error}", ex.Message);
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
    public async Task<IActionResult> CreatePostAsync([FromBody] CreatePostModel body)
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

            bool isMember = await _memberData.IsMemberAsync(loggedInUser.Id, community.Id);
            bool isOwner = loggedInUser.Id == community.Id;
            bool isAllowed = isOwner || isMember;
            if (isAllowed is false)
            {
                return StatusCode(401, "Unauthorized");
            }

            bool isBanned = await _banData.IsBannedAsync(loggedInUser.Id, community.Id);
            if (isBanned)
            {
                return BadRequest("You are banned from the community");
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
    public async Task<IActionResult> UpdatePostAsync([FromBody] UpdatePostModel body)
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
            if (post is null)
            {
                return BadRequest("Post not found");
            }

            if (post.UserId != loggedInUser.Id)
            {
                return StatusCode(401, "Unauthorized");
            }

            await _postData.DeletePostAsync(id, post.CommunityId);

            return Ok(post);
        }
        catch (Exception ex)
        {
            _logger.LogError("[POST_CONTROLLER_PATCH]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }
}
