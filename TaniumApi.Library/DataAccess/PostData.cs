﻿using Dapper;
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
        parameters.Add("Id", post.Id);
        var upvotes = await _sql.GetAllDataAsync<UpvoteModel>("dbo.spUpvote_GetByPostId", parameters);
        var downvotes = await _sql.GetAllDataAsync<DownvoteModel>("dbo.spDownvote_GetByPostId", parameters);

        post.User = user;
        post.Community = community;
        post.Upvotes = upvotes;
        post.Downvotes = downvotes;

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

        return output;
    }

    public async Task DeletePostAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        await _sql.SaveDataAsync<PostModel>("dbo.spPost_Delete", parameters);
    }
}
