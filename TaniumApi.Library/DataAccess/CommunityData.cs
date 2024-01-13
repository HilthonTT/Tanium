using Dapper;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Frozen;
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
        var communities = await _sql.GetAllDataAsync<CommunityModel>("dbo.spCommunity_GetAll");

        var userDictionary = users.ToFrozenDictionary(u => u.Id);
        foreach (var community in communities)
        {
            if (userDictionary.TryGetValue(community.UserId, out var user))
            {
                community.User = user;
            }
        }

        _cache.Set(CacheName, communities, TimeSpan.FromMinutes(30));

        return communities;
    }

    public async Task<CommunityModel> GetCommunityAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        var output = await _sql.GetDataAsync<CommunityModel>("dbo.spCommunity_GetById", parameters);

        return output;
    }

    public async Task<CommunityModel> CreateCommunityAsync(CommunityModel community)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Name", community.Name);
        parameters.Add("Description", community.Description);
        parameters.Add("UserId", community.UserId);

        var output = await _sql.SaveDataAsync<CommunityModel>("dbo.spCommunity_Insert", parameters);

        return output;
    }

    public async Task<CommunityModel> UpdateCommunityAsync(CommunityModel community)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", community.Id);
        parameters.Add("Name", community.Name);
        parameters.Add("Description", community.Description);

        var output = await _sql.SaveDataAsync<CommunityModel>("dbo.spCommunity_Update", parameters);

        return output;
    }

    public async Task DeleteCommunityAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        await _sql.SaveDataAsync<CommunityModel>("dbo.spCommunity_Delete", parameters);
    }
}
