using Dapper;
using TaniumApi.Library.Cache.Interfaces;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public class CommunityData(ISqlDataAccess sql, IRedisCache redisCache) : ICommunityData
{
    private const string CacheName = nameof(CommunityData);
    private readonly ISqlDataAccess _sql = sql;
    private readonly IRedisCache _redisCache = redisCache;

    private static List<CommunityModel> MapDataToCommunities(List<CommunityModel> communities, CommunityDataModel relatedData)
    {
        var userDictionary = relatedData.Users.ToDictionary(u => u.Id);

        var userIds = new HashSet<int>(relatedData.Users.Select(u => u.Id));

        Parallel.ForEach(communities, community =>
        {
            if (userIds.TryGetValue(community.UserId, out int userId))
            {
                community.User = userDictionary[userId];
            }
        });

        return communities;
    }

    private async Task<CommunityDataModel> GetRelatedDataAsync()
    {
        var data = new CommunityDataModel
        {
            Users = await _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll"),
        };

        return data;
    }

    public async Task<List<CommunityModel>> GetAllCommunitiesAsync()
    {
        var output = await _redisCache.GetRecordAsync<List<CommunityModel>>(CacheName);
        if (output is not null)
        {
            return output;
        }

        var relatedData = await GetRelatedDataAsync();
        var communities = await _sql.GetAllDataAsync<CommunityModel>("dbo.spCommunity_GetAll");

        output = MapDataToCommunities(communities, relatedData);

        await _redisCache.SetRecordAsync(CacheName, output, TimeSpan.FromMinutes(30));
        
        return output;
    }

    
    public async Task<List<CommunityModel>> GetCommunitiesUserAsync(int userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);

        var communities = await _sql.GetAllDataAsync<CommunityModel>("dbo.spCommunity_GetByUserId", parameters);
        var relatedData = await GetRelatedDataAsync();

        var output = MapDataToCommunities(communities, relatedData);

        return output;
    }

    public async Task<CommunityModel> GetCommunityAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        var output = await _sql.GetDataAsync<CommunityModel>("dbo.spCommunity_GetById", parameters);
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

    public async Task<int> GetCreatedCommunityCountAsync(int userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);

        var communities = await _sql.GetAllDataAsync<CommunityModel>("dbo.spCommunity_GetCreatedByUserId", parameters);

        return communities.Count;
    }

    public async Task<CommunityModel> CreateCommunityAsync(CommunityModel community)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Name", community.Name);
        parameters.Add("Description", community.Description);
        parameters.Add("UserId", community.UserId);
        parameters.Add("ImageUrl", community.ImageUrl);
        parameters.Add("BannerUrl", community.BannerUrl);

        var output = await _sql.SaveDataAsync<CommunityModel>("dbo.spCommunity_Insert", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", output.UserId);

        var user = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);

        output.User = user;

        return output;
    }

    public async Task<CommunityModel> UpdateCommunityAsync(CommunityModel community)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", community.Id);
        parameters.Add("Name", community.Name);
        parameters.Add("Description", community.Description);
        parameters.Add("ImageUrl", community.ImageUrl);
        parameters.Add("BannerUrl", community.BannerUrl);

        var output = await _sql.SaveDataAsync<CommunityModel>("dbo.spCommunity_Update", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", output.UserId);

        var user = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);

        output.User = user;

        return output;
    }

    public async Task DeleteCommunityAsync(CommunityModel community)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", community.Id);

        await _sql.SaveDataAsync<CommunityModel>("dbo.spCommunity_Delete", parameters);
    }
}
