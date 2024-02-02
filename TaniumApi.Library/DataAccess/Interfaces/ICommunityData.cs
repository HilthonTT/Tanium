using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess.Interfaces;
public interface ICommunityData
{
    Task<CommunityModel> CreateCommunityAsync(CommunityModel community);
    Task DeleteCommunityAsync(CommunityModel community);
    Task<List<CommunityModel>> GetAllCommunitiesAsync();
    Task<List<CommunityModel>> GetCommunitiesUserAsync(int userId);
    Task<CommunityModel> GetCommunityAsync(int id);
    Task<int> GetCreatedCommunityCountAsync(int userId);
    Task<CommunityModel> UpdateCommunityAsync(CommunityModel community);
}