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
public class ReplyController(
    IReplyData replyData,
    IPostData postData,
    IAuthService authService,
    ILogger<ReplyController> logger) : ControllerBase
{
    private readonly IReplyData _replyData = replyData;
    private readonly IPostData _postData = postData;
    private readonly IAuthService _authService = authService;
    private readonly ILogger<ReplyController> _logger = logger;

    [HttpGet("post/{id}")]
	[AllowAnonymous]
    public async Task<IActionResult> GetAllRepliesByPostIdAsync(int id)
    {
		try
		{
            var post = await _postData.GetPostByIdAsync(id);
            if (post is null)
            {
                return BadRequest("Post not found");
            }

            var replies = await _replyData.GetRepliesByPostIdAsync(id);

            return Ok(replies);
		}
		catch (Exception ex)
		{
            _logger.LogError("[REPLY_CONTROLLER_GET_POST_ID]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
		}
    }

    [HttpPost]
    public async Task<IActionResult> CreateReplyAsync(CreateReplyModel body)
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

            var post = await _postData.GetPostByIdAsync(body.PostId);
            if (post is null)
            {
                return BadRequest("Post not found");
            }

            var data = new ReplyModel()
            {
                Content = body.Content,
                ImageUrl = body.ImageUrl,
                UserId = loggedInUser.Id,
                PostId = body.PostId,
            };

            var createdReply = await _replyData.CreateReplyAsync(data);

            return Ok(createdReply);
        }
        catch (Exception ex)
        {
            _logger.LogError("[REPLY_CONTROLLER_POST]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpPatch]
    public async Task<IActionResult> UpdateReplyAsync(UpdateReplyModel body)
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

            var reply = await _replyData.GetReplyByIdAsync(body.Id);
            if (reply is null)
            {
                return BadRequest("Reply not found");
            }

            if (reply.UserId != loggedInUser.Id)
            {
                return StatusCode(401, "Unauthorized");
            }

            var data = new ReplyModel()
            {
                Id = body.Id,
                Content = reply.Content,
                ImageUrl = reply.ImageUrl,
            };

            var updatedReply = await _replyData.UpdateReplyAsync(data);

            return Ok(updatedReply);
        }
        catch (Exception ex)
        {
            _logger.LogError("[REPLY_CONTROLLER_PATCH]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReplyAsync(int id)
    {
        try
        {
            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            var reply = await _replyData.GetReplyByIdAsync(id);
            if (reply.UserId != loggedInUser.Id)
            {
                return StatusCode(401, "Unauthorized");
            }

            await _replyData.DeleteReplyAsync(reply.Id);

            return Ok(reply);
        }
        catch (Exception ex)
        {
            _logger.LogError("[REPLY_CONTROLLER_DELETE]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }
}