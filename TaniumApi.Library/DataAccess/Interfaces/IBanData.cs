using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess.Interfaces;
public interface IBanData
{
    Task<BanModel> CreateBanAsync(BanModel ban);
    Task DeleteBanAsync(int id);
    Task<BanModel> GetBanAsync(int id);
    Task<List<BanModel>> GetCommunityBansAsync(int communityId);
    Task<bool> IsBannedAsync(int userId, int communityId);
}