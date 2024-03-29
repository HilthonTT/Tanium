﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.AspNetCore.RateLimiting;
using TaniumApi.Authentication.Interfaces;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Controllers;
[Route("api/[controller]")]
[ApiController]
[Authorize]
[EnableCors]
[EnableRateLimiting("fixed")]
[OutputCache(PolicyName = "Default")]
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

            var totalUpvotes = new List<UpvoteModel>();

            var existingUpvote = await _voteData.GetUpvoteByUserIdAndPostIdAsync(loggedInUser.Id, postId);
            if (existingUpvote is not null)
            {
                await _voteData.DeleteUpvoteAsync(loggedInUser.Id, postId);

                totalUpvotes = await _voteData.GetPostUpvotesAsync(postId);

                return Ok(totalUpvotes);
            }

            var existingDownVote = await _voteData.GetDownvoteByUserIdAndPostIdAsync(loggedInUser.Id, postId);
            if (existingDownVote is not null)
            {
                await _voteData.DeleteDownvoteAsync(loggedInUser.Id, postId);
            }

            var createdUpvote = await _voteData.CreateUpvoteAsync(loggedInUser.Id, postId);

            totalUpvotes = await _voteData.GetPostUpvotesAsync(postId);

            return Ok(totalUpvotes);
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

            var totalDownvotes = new List<DownvoteModel>();

            var existingDownvote = await _voteData.GetDownvoteByUserIdAndPostIdAsync(loggedInUser.Id, postId);
            if (existingDownvote is not null)
            {
                await _voteData.DeleteDownvoteAsync(loggedInUser.Id, postId);

                totalDownvotes = await _voteData.GetPostDownvotesAsync(postId);

                return Ok(totalDownvotes);
            }

            var existingUpvote = await _voteData.GetUpvoteByUserIdAndPostIdAsync(loggedInUser.Id, postId);
            if (existingUpvote is not null)
            {
                await _voteData.DeleteUpvoteAsync(loggedInUser.Id, postId);
            }

            var createdDownvote = await _voteData.CreateDownvoteAsync(loggedInUser.Id, postId);

            totalDownvotes = await _voteData.GetPostDownvotesAsync(postId);

            return Ok(totalDownvotes);
        }
        catch (Exception ex)
        {
            _logger.LogError("[VOTE_CONTROLLER_DOWNVOTE_POST]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }
}
