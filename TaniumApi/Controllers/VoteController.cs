using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using TaniumApi.Authentication.Interfaces;
using TaniumApi.Library.DataAccess.Interfaces;

namespace TaniumApi.Controllers;
[Route("api/[controller]")]
[ApiController]
[Authorize]
[EnableCors("AllowSpecificOrigin")]
public class VoteController(
    IVoteData voteData,
    IPostData postData,
    IAuthService authService,
    ILogger<VoteController> logger) : ControllerBase
{
    private readonly IVoteData _voteData = voteData;
    private readonly IPostData _postData = postData;
    private readonly IAuthService _authService = authService;
    private readonly ILogger<VoteController> _logger = logger;

    [HttpPost("upvote/{postId}")]
    public async Task<IActionResult> CreateUpvoteAsync(int postId)
    {
        try
        {
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            var post = await _postData.GetPostByIdAsync(postId);
            if (post is null)
            {
                return BadRequest("Post not found");
            }

            var existingUpvote = await _voteData.GetUpvoteByUserIdAndPostIdAsync(loggedInUser.Id, postId);
            if (existingUpvote is not null)
            {
                await _voteData.DeleteUpvoteAsync(loggedInUser.Id, postId);
                return Ok(existingUpvote);
            }

            var existingDownVote = await _voteData.GetDownvoteByUserIdAndPostIdAsync(loggedInUser.Id, postId);
            if (existingDownVote is not null)
            {
                await _voteData.DeleteDownvoteAsync(loggedInUser.Id, postId);
            }

            var createdUpvote = await _voteData.CreateUpvoteAsync(loggedInUser.Id, postId);

            return Ok(createdUpvote);
        }
        catch (Exception ex)
        {
            _logger.LogError("[VOTE_CONTROLLER_UPVOTE_POST]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpPost("downvote/{postId}")]
    public async Task<IActionResult> CreateDownvoteAsync(int postId)
    {
        try
        {
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            var post = await _postData.GetPostByIdAsync(postId);
            if (post is null)
            {
                return BadRequest("Post not found");
            }

            var existingDownvote = await _voteData.GetDownvoteByUserIdAndPostIdAsync(loggedInUser.Id, postId);
            if (existingDownvote is not null)
            {
                await _voteData.DeleteDownvoteAsync(loggedInUser.Id, postId);
                return Ok(existingDownvote);
            }

            var existingUpvote = await _voteData.GetUpvoteByUserIdAndPostIdAsync(loggedInUser.Id, postId);
            if (existingUpvote is not null)
            {
                await _voteData.DeleteUpvoteAsync(loggedInUser.Id, postId);
            }

            var createdDownvote = await _voteData.CreateDownvoteAsync(loggedInUser.Id, postId);
            return Ok(createdDownvote);
        }
        catch (Exception ex)
        {
            _logger.LogError("[VOTE_CONTROLLER_DOWNVOTE_POST]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }
}
