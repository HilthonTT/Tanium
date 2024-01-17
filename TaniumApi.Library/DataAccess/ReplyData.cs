using Dapper;
using System.Collections.Frozen;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public class ReplyData(ISqlDataAccess sql) : IReplyData
{
    private readonly ISqlDataAccess _sql = sql;

    public async Task<List<ReplyModel>> GetRepliesByPostIdAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        var post = await _sql.GetDataAsync<PostModel>("dbo.spPost_GetById", parameters);

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
        var reply = await _sql.GetDataAsync<ReplyModel>("dbo.spReply_GetById", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", reply.UserId);
        var user = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);

        reply.User = user;

        return reply;
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

        var post = await _sql.GetDataAsync<PostModel>("dbo.spPost_GetById", parameters);

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

        var post = await _sql.GetDataAsync<PostModel>("dbo.spPost_GetById", parameters);

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
