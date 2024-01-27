using Dapper;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public class BanData(ISqlDataAccess sql) : IBanData
{
    private readonly ISqlDataAccess _sql = sql;

    public async Task<BanModel> GetBanAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        var ban = await _sql.GetDataAsync<BanModel>("dbo.spBan_GetById", parameters);
        if (ban is null)
        {
            return null;
        }

        parameters = new DynamicParameters();
        parameters.Add("Id", ban.BannedUserId);

        var bannedUser = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);
        ban.BannedUser = bannedUser;

        parameters = new DynamicParameters();
        parameters.Add("Id", ban.BannerUserId);

        var bannerUser = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);
        ban.BannerUser = bannerUser;

        return ban;
    }

    public async Task<List<BanModel>> GetCommunityBansAsync(int communityId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", communityId);

        var community = await _sql.GetDataAsync<CommunityModel>("dbo.spCommunity_GetById", parameters);

        parameters = new DynamicParameters();
        parameters.Add("CommunityId", communityId);

        var bans = await _sql.GetAllDataAsync<BanModel>("dbo.spBan_GetByCommunityId", parameters);
        var users = await _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll", parameters);

        var userDictionary = users.ToDictionary(u => u.Id);
        var userIds = new HashSet<int>(users.Select(u => u.Id));

        Parallel.ForEach(bans, ban =>
        {
            if (userIds.TryGetValue(ban.BannerUserId, out int bannerUserId))
            {
                ban.BannerUser = userDictionary[bannerUserId];
            }

            if (userIds.TryGetValue(ban.BannedUserId, out int bannedUserId))
            {
                ban.BannerUser = userDictionary[bannedUserId];
            }
        });

        return bans;
    }

    public async Task<bool> IsBannedAsync(int userId, int communityId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);
        parameters.Add("CommunityId", communityId);

        var ban = await _sql.GetDataAsync<BanModel>("dbo.spBan_GetByUserIdAndCommunityId", parameters);

        bool isBanned = ban is not null;

        return isBanned;
    }

    public async Task<BanModel> CreateBanAsync(BanModel ban)
    {
        try
        {
            _sql.StartTransaction();

            var parameters = new DynamicParameters();
            parameters.Add("Reason", ban.Reason);
            parameters.Add("BannerUserId", ban.BannerUserId);
            parameters.Add("BannedUserId", ban.BannedUserId);
            parameters.Add("CommunityId", ban.CommunityId);

            var output = await _sql.SaveInTransactionAsync<BanModel>("dbo.spBan_Insert", parameters);

            parameters = new DynamicParameters();
            parameters.Add("UserId", output.BannedUserId);
            parameters.Add("CommunityId", output.CommunityId);

            await _sql.SaveInTransactionAsync<MemberModel>(
                "dbo.spMember_DeleteByUserIdAndCommunityId", parameters);

            _sql.CommitTransaction();

            output = await GetBanAsync(output.Id);

            return output;
        }
        catch (Exception ex)
        {
            _sql.RollbackTransaction();
            throw new Exception(ex.Message);
        }
    }

    public async Task DeleteBanAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        await _sql.SaveDataAsync<BanModel>("dbo.spBan_Delete", parameters);
    }
}
