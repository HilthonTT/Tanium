using Dapper;
using Microsoft.Extensions.Caching.Memory;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public class CommunityData(ISqlDataAccess sql, IMemoryCache cache) : ICommunityData
{
    private const string CacheName = nameof(CommunityData);
    private readonly ISqlDataAccess _sql = sql;
    private readonly IMemoryCache _cache = cache;

    public async Task<List<CommunityModel>> GetAllCommunitiesAsync()
    {
        var output = _cache.Get<List<CommunityModel>>(CacheName);
        if (output is not null)
        {
            return output;
        }

        var users = await _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll");
        output = await _sql.GetAllDataAsync<CommunityModel>("dbo.spCommunity_GetAll");

        var userDictionary = users.ToDictionary(u => u.Id);
        foreach (var community in output)
        {
            if (userDictionary.TryGetValue(community.UserId, out var user))
            {
                community.User = user;
            }
        }

        _cache.Set(CacheName, output, TimeSpan.FromMinutes(30));

        return output;
    }

    
    public async Task<List<CommunityModel>> GetCommunitiesUserAsync(int userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);
        var userMembers = await _sql.GetAllDataAsync<MemberModel>("dbo.spMember_GetByUserId", parameters);

        var communityIds = new HashSet<int>(userMembers.Select(m => m.CommunityId));

        var users = await _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll");
        var communities = await _sql.GetAllDataAsync<CommunityModel>("dbo.spCommunity_GetAll");

        var userDictionary = users.ToDictionary(u => u.Id);
        foreach (var community in communities)
        {
            if (userDictionary.TryGetValue(community.UserId, out var user))
            {
                community.User = user;
            }
        }

        var userCommunities = communities.Where(c => communityIds.Contains(c.Id)).ToList();

        return userCommunities;
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

    public async Task DeleteCommunityAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        await _sql.SaveDataAsync<CommunityModel>("dbo.spCommunity_Delete", parameters);
    }
}
