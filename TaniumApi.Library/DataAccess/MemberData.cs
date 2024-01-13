using Dapper;
using System.Collections.Frozen;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public class MemberData(ISqlDataAccess sql) : IMemberData
{
    private readonly ISqlDataAccess _sql = sql;

    public async Task<List<MemberModel>> GetAllMemberByCommunityIdAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        var community = await _sql.GetDataAsync<CommunityModel>("dbo.spCommunity_GetById", parameters);
        var members = await _sql.GetAllDataAsync<MemberModel>("dbo.spMember_GetByCommunityId", parameters);

        var users = await _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll");
        var userDictionary = users.ToFrozenDictionary(u => u.Id);

        foreach (var member in members)
        {
            member.Community = community;
            if (userDictionary.TryGetValue(member.UserId, out var user))
            {
                member.User = user;
            }
        }

        return members;
    }

    public async Task<MemberModel> GetMemberByIdAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);
        var member = await _sql.GetDataAsync<MemberModel>("dbo.spMember_GetById", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", member.User);
        var user = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);

        member.User = user;

        return member;
    }

    public async Task<MemberModel> CreateMemberAsync(MemberModel member)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", member.UserId);
        parameters.Add("CommunityId", member.CommunityId);

        var output = await _sql.SaveDataAsync<MemberModel>("dbo.spMember_Insert", parameters);

        return output;
    }

    public async Task DeleteMemberAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        await _sql.SaveDataAsync<MemberModel>("dbo.spMember_Delete", parameters);
    }

    public async Task<bool> IsMemberAsync(int userId, int communityId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);
        parameters.Add("CommunityId", communityId);

        var member = await _sql.GetDataAsync<MemberModel>("dbo.spMember_GetByCommunityIdAndUserId", parameters);

        bool isMember = member is not null;

        return isMember;
    }
}
