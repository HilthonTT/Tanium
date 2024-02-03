using Dapper;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public class VoteData(ISqlDataAccess sql) : IVoteData
{
    private readonly ISqlDataAccess _sql = sql;

    public async Task<List<UpvoteModel>> GetPostUpvotesAsync(int postId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("PostId", postId);

        var output = await _sql.GetAllDataAsync<UpvoteModel>("dbo.spUpvote_GetByPostId", parameters);

        return output;
    }
    
    public async Task<List<DownvoteModel>> GetPostDownvotesAsync(int postId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("PostId", postId);

        var output = await _sql.GetAllDataAsync<DownvoteModel>("dbo.spDownvote_GetByPostId", parameters);

        return output;
    }

    public async Task<UpvoteModel> GetUpvoteByUserIdAndPostIdAsync(int userId, int postId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);
        parameters.Add("PostId", postId);

        var output = await _sql.GetDataAsync<UpvoteModel>("dbo.spUpvote_GetByPostIdAndUserId", parameters);

        return output;
    }

    public async Task<UpvoteModel> CreateUpvoteAsync(int userId, int postId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);
        parameters.Add("PostId", postId);

        var output = await _sql.SaveDataAsync<UpvoteModel>("dbo.spUpvote_Insert", parameters);

        return output;
    }

    public async Task DeleteUpvoteAsync(int userId, int postId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);
        parameters.Add("PostId", postId);

        await _sql.SaveDataAsync<UpvoteModel>("dbo.spUpvote_Delete", parameters);
    }

    public async Task<UpvoteModel> GetDownvoteByUserIdAndPostIdAsync(int userId, int postId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);
        parameters.Add("PostId", postId);

        var output = await _sql.GetDataAsync<UpvoteModel>("dbo.spDownvote_GetByPostIdAndUserId", parameters);

        return output;
    }

    public async Task<UpvoteModel> CreateDownvoteAsync(int userId, int postId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);
        parameters.Add("PostId", postId);

        var output = await _sql.SaveDataAsync<UpvoteModel>("dbo.spDownvote_Insert", parameters);

        return output;
    }

    public async Task DeleteDownvoteAsync(int userId, int postId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);
        parameters.Add("PostId", postId);

        await _sql.SaveDataAsync<UpvoteModel>("dbo.spDownvote_Delete", parameters);
    }
}
