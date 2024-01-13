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
        var users = await _sql.GetAllDataAsync<UserModel>("dbo.spCommunity_GetAll");

        parameters = new DynamicParameters();
        parameters.Add("CommunityId", community);

        output = await _sql.GetAllDataAsync<PostModel>("dbo.spPost_GetByCommunityId", parameters);

        var userDictionary = users.ToFrozenDictionary(u => u.Id);
        foreach (var post in output)
        {
            post.Community = community;
            if (userDictionary.TryGetValue(community.UserId, out var user))
            {
                post.User = user;  
            }
        }

        _cache.Set(key, output, TimeSpan.FromMinutes(20));

        return output;
    }

    public async Task<PostModel> GetPostByIdAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        var output = await _sql.GetDataAsync<PostModel>("dbo.spPost_GetById", parameters);

        return output;
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
