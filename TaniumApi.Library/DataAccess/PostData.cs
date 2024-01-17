using Dapper;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Frozen;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public class PostData(ISqlDataAccess sql, IMemoryCache cache) : IPostData
{
    private const string CacheName = nameof(PostData);
    private readonly ISqlDataAccess _sql = sql;
    private readonly IMemoryCache _cache = cache;

    public async Task<List<PostModel>> GetAllPostsAsync()
    {
        var output = _cache.Get<List<PostModel>>(CacheName);
        if (output is not null)
        {
            return output;
        }

        var communities = await _sql.GetAllDataAsync<CommunityModel>("dbo.spCommunity_GetAll");
        var users = await _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll");
        var posts = await _sql.GetAllDataAsync<PostModel>("dbo.spPost_GetAll");

        var upvotes = await _sql.GetAllDataAsync<UpvoteModel>("dbo.spUpvote_GetAll");
        var downvotes = await _sql.GetAllDataAsync<DownvoteModel>("dbo.spDownvote_GetAll");
        var replies = await _sql.GetAllDataAsync<ReplyModel>("dbo.spReply_GetAll");

        var communityDictionary = communities.ToFrozenDictionary(c => c.Id);
        var userDictionary = users.ToFrozenDictionary(u => u.Id);

        foreach (var post in posts)
        {
            if (communityDictionary.TryGetValue(post.CommunityId, out var community))
            {
                post.Community = community;
            }

            if (userDictionary.TryGetValue(post.UserId, out var user))
            {
                post.User = user;
            }

            post.Downvotes = downvotes.Where(d => d.PostId == post.Id).ToList();
            post.Upvotes = upvotes.Where(u => u.PostId == post.Id).ToList();
            post.Replies = replies.Where(r => r.PostId  == post.Id).ToList();
        }

        _cache.Set(CacheName, output, TimeSpan.FromMinutes(30));  

        return posts;
    }

    public async Task<List<PostModel>> GetPostsByCommunityIdAsync(int communityId)
    {
        string key = $"{CacheName}_{communityId}";
        var output = _cache.Get<List<PostModel>>(key);
        if (output is not null)
        {
            return output;
        }

        var parameters = new DynamicParameters();
        parameters.Add("Id", communityId);

        var community = await _sql.GetDataAsync<CommunityModel>("dbo.spCommunity_GetById", parameters);
        var users = await _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll");

        var upvotes = await _sql.GetAllDataAsync<UpvoteModel>("dbo.spUpvote_GetAll");
        var downvotes = await _sql.GetAllDataAsync<DownvoteModel>("dbo.spDownvote_GetAll");
        var replies = await _sql.GetAllDataAsync<ReplyModel>("dbo.spReply_GetAll");

        parameters = new DynamicParameters();
        parameters.Add("CommunityId", community.Id);
        output = await _sql.GetAllDataAsync<PostModel>("dbo.spPost_GetByCommunityId", parameters);

        var userDictionary = users.ToFrozenDictionary(u => u.Id);
        foreach (var post in output)
        {
            post.Community = community;
            if (userDictionary.TryGetValue(community.UserId, out var user))
            {
                post.User = user;  
            }

            post.Upvotes = upvotes.Where(u => u.PostId == post.Id).ToList();
            post.Downvotes = downvotes.Where(d => d.PostId == post.Id).ToList();
            post.Replies = replies.Where(r => r.PostId == post.Id).ToList();
        }

        _cache.Set(key, output, TimeSpan.FromMinutes(20));

        return output;
    }

    public async Task<PostModel> GetPostByIdAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);
        var post = await _sql.GetDataAsync<PostModel>("dbo.spPost_GetById", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", post.UserId);
        var user = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", post.CommunityId);
        var community = await _sql.GetDataAsync<CommunityModel>("dbo.spCommunity_GetById", parameters);

        parameters = new DynamicParameters();
        parameters.Add("PostId", post.Id);
        var upvotes = await _sql.GetAllDataAsync<UpvoteModel>("dbo.spUpvote_GetByPostId", parameters);
        var downvotes = await _sql.GetAllDataAsync<DownvoteModel>("dbo.spDownvote_GetByPostId", parameters);
        var replies = await _sql.GetAllDataAsync<ReplyModel>("dbo.spReply_GetByPostId", parameters);

        post.User = user;
        post.Community = community;
        post.Upvotes = upvotes;
        post.Downvotes = downvotes;
        post.Replies = replies;

        return post;
    }

    public async Task<PostModel> CreatePostAsync(PostModel post)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Title", post.Title);
        parameters.Add("Description", post.Description);
        parameters.Add("CommunityId", post.CommunityId);
        parameters.Add("UserId", post.UserId);
        parameters.Add("ImageUrl", post.ImageUrl);

        var output = await _sql.SaveDataAsync<PostModel>("dbo.spPost_Insert", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", post.CommunityId);

        var community = await _sql.GetDataAsync<CommunityModel>("dbo.spCommunity_GetById", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", post.UserId);

        var user = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);

        post.User = user;
        post.Community = community;

        return output;
    }

    public async Task<PostModel> UpdatePostAsync(PostModel post)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", post.Id);
        parameters.Add("Title", post.Title);
        parameters.Add("Description", post.Description);
        parameters.Add("ImageUrl", post.ImageUrl);

        var output = await _sql.SaveDataAsync<PostModel>("dbo.spPost_Update", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", post.CommunityId);

        var community = await _sql.GetDataAsync<CommunityModel>("dbo.spCommunity_GetById", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", post.UserId);

        var user = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);

        post.User = user;
        post.Community = community;

        return output;
    }

    public async Task DeletePostAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        await _sql.SaveDataAsync<PostModel>("dbo.spPost_Delete", parameters);
    }
}
