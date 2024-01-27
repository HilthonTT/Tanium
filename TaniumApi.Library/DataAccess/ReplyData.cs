using Dapper;
using TaniumApi.Library.Cache.Interfaces;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public class ReplyData(ISqlDataAccess sql, IRedisCache redisCache) : IReplyData
{
    private const string CacheName = nameof(ReplyData);
    private readonly ISqlDataAccess _sql = sql;
    private readonly IRedisCache _redisCache = redisCache;

    private static List<ReplyModel> MapDataToReplies(List<ReplyModel> replies, ReplyDataModel relatedData)
    {
        var userDictionary = relatedData.Users.ToDictionary(u => u.Id);
        var postDictionary = relatedData.Posts.ToDictionary(p => p.Id);

        var userIds = new HashSet<int>(relatedData.Users.Select(u => u.Id));
        var postIds = new HashSet<int>(relatedData.Posts.Select(p => p.Id));

        Parallel.ForEach(replies, reply =>
        {
            if (userIds.TryGetValue(reply.UserId, out int userId))
            {
                reply.User = userDictionary[userId];
            }

            if (postIds.TryGetValue(reply.UserId, out int postId))
            {
                reply.Post = postDictionary[postId];
            }
        });

        return replies;
    }

    private async Task<ReplyDataModel> GetRelatedDataAsync()
    {
        var postsTask = _sql.GetAllDataAsync<BasicPostModel>("dbo.spPost_GetAll");
        var usersTask = _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll");

        await Task.WhenAll(postsTask, usersTask);

        var data = new ReplyDataModel
        {
            Posts = postsTask.Result,
            Users = usersTask.Result,
        };

        return data;
    }

    public async Task<List<ReplyModel>> GetAllRepliesAsync()
    {
        var output = await _redisCache.GetRecordAsync<List<ReplyModel>>(CacheName);
        if (output is not null)
        {
            return output;
        }

        var relatedData = await GetRelatedDataAsync();
        var replies = await _sql.GetAllDataAsync<ReplyModel>("dbo.spReply_GetAll");

        output = MapDataToReplies(replies, relatedData);

        await _redisCache.SetRecordAsync(CacheName, output, TimeSpan.FromMinutes(30));

        return output;
    }

    public async Task<List<ReplyModel>> GetUserRepliesAsync(int userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);

        var relatedData = await GetRelatedDataAsync();
        var replies = await _sql.GetAllDataAsync<ReplyModel>("dbo.spReply_GetByUserId", parameters);

        var output = MapDataToReplies(replies, relatedData);

        return output;
    }

    public async Task<List<ReplyModel>> GetRepliesByPostIdAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        var post = await _sql.GetDataAsync<BasicPostModel>("dbo.spPost_GetById", parameters);

        parameters = new DynamicParameters();
        parameters.Add("PostId", id);
        var replies = await _sql.GetAllDataAsync<ReplyModel>("dbo.spReply_GetByPostId", parameters);
        var users = await _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll");

        var userDictionary = users.ToDictionary(u => u.Id);
        var userIds = new HashSet<int>(users.Select(u => u.Id));

        Parallel.ForEach(replies, reply =>
        {
            reply.Post = post;
            if (userIds.TryGetValue(reply.UserId, out int userId))
            {
                reply.User = userDictionary[userId];
            }
        });

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

        var output = await _sql.SaveDataAsync<ReplyModel>("dbo.spReply_Update", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", reply.PostId);

        var post = await _sql.GetDataAsync<BasicPostModel>("dbo.spPost_GetById", parameters);

        output.Post = post;

        return output;
    }

    public async Task DeleteReplyAsync(ReplyModel reply)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", reply.Id);

        await _sql.SaveDataAsync<ReplyModel>("dbo.spReply_Delete", parameters);
    }
}
