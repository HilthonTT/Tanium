using Dapper;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Frozen;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public class ReplyData(ISqlDataAccess sql, IMemoryCache cache) : IReplyData
{
    private const string CacheName = nameof(ReplyData);
    private readonly ISqlDataAccess _sql = sql;
    private readonly IMemoryCache _cache = cache;

    public async Task<List<ReplyModel>> GetAllRepliesAsync()
    {
        var output = _cache.Get<List<ReplyModel>>(CacheName);
        if (output is not null)
        {
            return output;
        }

        var posts = await _sql.GetAllDataAsync<BasicPostModel>("dbo.spPost_GetAll");
        var users = await _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll");
        output = await _sql.GetAllDataAsync<ReplyModel>("dbo.spReply_GetAll");

        var userDictionary = users.ToFrozenDictionary(u => u.Id);
        var postDictionary = posts.ToFrozenDictionary(p => p.Id);

        foreach (var reply in output)
        {
            if (userDictionary.TryGetValue(reply.UserId, out var user))
            {
                reply.User = user;
            }

            if (postDictionary.TryGetValue(reply.PostId, out var post))
            {
                reply.Post = post;
            }
        }

        _cache.Set(CacheName, output, TimeSpan.FromMinutes(30));

        return output;
    }

    public async Task<List<ReplyModel>> GetRepliesByPostIdAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        var post = await _sql.GetDataAsync<BasicPostModel>("dbo.spPost_GetById", parameters);

        var replies = await _sql.GetAllDataAsync<ReplyModel>("dbo.spReply_GetByPostId", parameters);
        var users = await _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll");

        var userDictionary = users.ToFrozenDictionary(u => u.Id);
        foreach (var reply in replies)
        {
            reply.Post = post;
            if (userDictionary.TryGetValue(reply.UserId, out var user))
            {
                reply.User = user;
            }
        }

        return replies;
    }

    public async Task<ReplyModel> GetReplyByIdAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        var output = await _sql.GetDataAsync<ReplyModel>("dbo.spReply_GetById", parameters);
        if (output is null)
        {
            return default;
        }

        parameters = new DynamicParameters();
        parameters.Add("Id", output.UserId);
        var user = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);

        output.User = user;

        return output;
    }

    public async Task<ReplyModel> CreateReplyAsync(ReplyModel reply)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Content", reply.Content);
        parameters.Add("ImageUrl", reply.ImageUrl);
        parameters.Add("UserId", reply.UserId);
        parameters.Add("PostId", reply.PostId);

        var output = await _sql.SaveDataAsync<ReplyModel>("dbo.spReply_Insert", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", reply.PostId);

        var post = await _sql.GetDataAsync<BasicPostModel>("dbo.spPost_GetById", parameters);

        output.Post = post;

        return output;
    }

    public async Task<ReplyModel> UpdateReplyAsync(ReplyModel reply)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", reply.Id);
        parameters.Add("Content", reply.Content);
        parameters.Add("ImageUrl", reply.ImageUrl);

        var output = await _sql.SaveDataAsync<ReplyModel>("dbo.spReply_Update", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", reply.PostId);

        var post = await _sql.GetDataAsync<BasicPostModel>("dbo.spPost_GetById", parameters);

        output.Post = post;

        return output;
    }

    public async Task DeleteReplyAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        await _sql.SaveDataAsync<ReplyModel>("dbo.spReply_Delete", parameters);
    }
}
