using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess.Interfaces;
public interface ICommunityData
{
    Task<CommunityModel> CreateCommunityAsync(CommunityModel community);
    Task DeleteCommunityAsync(int id);
    Task<List<CommunityModel>> GetAllCommunitiesAsync();
    Task<CommunityModel> GetCommunityAsync(int id);
    Task<CommunityModel> UpdateCommunityAsync(CommunityModel community);
}