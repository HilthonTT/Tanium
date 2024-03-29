﻿namespace TaniumApi.Library.Models;
public class PostModel
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public int UserId { get; set; }
    public UserModel User { get; set; }
    public int CommunityId { get; set; }
    public BasicCommunityModel Community { get; set; }
    public List<UpvoteModel> Upvotes { get; set; } = [];
    public List<DownvoteModel> Downvotes { get; set; } = [];
    public List<ReplyModel> Replies { get; set; } = [];
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    public DateTime DateUpdated { get; set; }
}
