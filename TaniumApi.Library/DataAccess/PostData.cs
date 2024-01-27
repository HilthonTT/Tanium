using Dapper;
using TaniumApi.Library.Cache.Interfaces;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public class PostData(ISqlDataAccess sql, IRedisCache redisCache) : IPostData
{
    private const string CacheName = nameof(PostData);
    private readonly ISqlDataAccess _sql = sql;
    private readonly IRedisCache _redisCache = redisCache;

    private static List<PostModel> MapDataToPosts(List<PostModel> posts, PostDataModel relatedData)
    {
        var communityDictionary = relatedData.Communities.ToDictionary(c => c.Id);
        var userDictionary = relatedData.Users.ToDictionary(u => u.Id);

        var communityIds = new HashSet<int>(relatedData.Communities.Select(c => c.Id));
        var userIds = new HashSet<int>(relatedData.Users.Select(u => u.Id));

        Parallel.ForEach(posts, post =>
        {
            if (communityIds.TryGetValue(post.CommunityId, out int communityId))
            {
                post.Community = communityDictionary[communityId];
            }

            if (userIds.TryGetValue(post.UserId, out int userId))
            {
                post.User = userDictionary[userId];
            }

            post.Downvotes = relatedData.Downvotes.Where(d => d.PostId == post.Id).ToList();
            post.Upvotes = relatedData.Upvotes.Where(u => u.PostId == post.Id).ToList();
            post.Replies = relatedData.Replies.Where(r => r.PostId == post.Id).ToList();
        });

        return posts;
    }

    private async Task<PostDataModel> GetRelatedDataAsync()
    {
        var communitiesTask = _sql.GetAllDataAsync<BasicCommunityModel>("dbo.spCommunity_GetAll");
        var usersTask = _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll");
        var upvotesTask = _sql.GetAllDataAsync<UpvoteModel>("dbo.spUpvote_GetAll");
        var downvotesTask = _sql.GetAllDataAsync<DownvoteModel>("dbo.spDownvote_GetAll");
        var repliesTask = _sql.GetAllDataAsync<ReplyModel>("dbo.spReply_GetAll");

        await Task.WhenAll(communitiesTask, usersTask, upvotesTask, downvotesTask, repliesTask);

        var data = new PostDataModel
        {
            Communities = communitiesTask.Result,
            Users = usersTask.Result,
            Upvotes = upvotesTask.Result,
            Downvotes = downvotesTask.Result,
            Replies = repliesTask.Result
        };

        return data;
    }

    public async Task<List<PostModel>> GetAllPostsAsync()
    {
        var output = await _redisCache.GetRecordAsync<List<PostModel>>(CacheName);
        if (output is not null)
        {
            return output;
        }

        var posts = await _sql.GetAllDataAsync<PostModel>("dbo.spPost_GetAll");
        var relatedData = await GetRelatedDataAsync();

        output = MapDataToPosts(posts, relatedData);
       
        await _redisCache.SetRecordAsync(CacheName, output, TimeSpan.FromMinutes(30)); 

        return posts;
    }

    public async Task<List<PostModel>> GetUserPostsAsync(int userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);

        var posts = await _sql.GetAllDataAsync<PostModel>("dbo.spPost_GetByUserId", parameters);
        var relatedData = await GetRelatedDataAsync();

        var output = MapDataToPosts(posts, relatedData);

        return output;
    }

    public async Task<List<PostModel>> GetDownvotedPostsAsync(int userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);

        var posts = await _sql.GetAllDataAsync<PostModel>("dbo.spPost_GetDownvoted", parameters);
        var relatedData = await GetRelatedDataAsync();

        var output = MapDataToPosts(posts, relatedData);

        return output;
    }

    public async Task<List<PostModel>> GetUpvotedPostsAsync(int userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);

        var posts = await _sql.GetAllDataAsync<PostModel>("dbo.spPost_GetUpvoted", parameters);
        var relatedData = await GetRelatedDataAsync();

        var output = MapDataToPosts(posts, relatedData);

        return output;
    }

    public async Task<List<PostModel>> GetPostsByCommunityIdAsync(int communityId)
    {
        string key = $"{CacheName}_{communityId}";
        var output = await _redisCache.GetRecordAsync<List<PostModel>>(key);
        if (output is not null)
        {
            return output;
        }

        var parameters = new DynamicParameters();
        parameters.Add("Id", communityId);

        var community = await _sql.GetDataAsync<BasicCommunityModel>("dbo.spCommunity_GetById", parameters);
        var users = await _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll");

        var upvotes = await _sql.GetAllDataAsync<UpvoteModel>("dbo.spUpvote_GetAll");
        var downvotes = await _sql.GetAllDataAsync<DownvoteModel>("dbo.spDownvote_GetAll");
        var replies = await _sql.GetAllDataAsync<ReplyModel>("dbo.spReply_GetAll");

        parameters = new DynamicParameters();
        parameters.Add("CommunityId", community.Id);
        output = await _sql.GetAllDataAsync<PostModel>("dbo.spPost_GetByCommunityId", parameters);

        var userDictionary = users.ToDictionary(u => u.Id);
        var userIds = new HashSet<int>(users.Select(u => u.Id));

        Parallel.ForEach(output, post =>
        {
            post.Community = community;
            if (userIds.TryGetValue(post.UserId, out int userId))
            {
                post.User = userDictionary[userId];
            }

            post.Upvotes = upvotes.Where(u => u.PostId == post.Id).ToList();
            post.Downvotes = downvotes.Where(d => d.PostId == post.Id).ToList();
            post.Replies = replies.Where(r => r.PostId == post.Id).ToList();
        });

        await _redisCache.SetRecordAsync(key, output, TimeSpan.FromMinutes(30));

        return output;
    }

    public async Task<PostModel> GetPostByIdAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);
        var post = await _sql.GetDataAsync<PostModel>("dbo.spPost_GetById", parameters);
        if (post is null)
        {
            return default;
        }

        parameters = new DynamicParameters();
        parameters.Add("Id", post.UserId);
        var user = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", post.CommunityId);
        var community = await _sql.GetDataAsync<BasicCommunityModel>("dbo.spCommunity_GetById", parameters);

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

        var community = await _sql.GetDataAsync<BasicCommunityModel>("dbo.spCommunity_GetById", parameters);

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

        var community = await _sql.GetDataAsync<BasicCommunityModel>("dbo.spCommunity_GetById", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", post.UserId);

        var user = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);

        post.User = user;
        post.Community = community;

        return output;
    }

    public async Task DeletePostAsync(int id, int? communityId = null)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        await _redisCache.RemoveAsync(CacheName);
        if (communityId is not null)
        {
            await _redisCache.RemoveAsync($"{CacheName}_{communityId}");
        }

        await _sql.SaveDataAsync<PostModel>("dbo.spPost_Delete", parameters);
    }
}
