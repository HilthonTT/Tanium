using Dapper;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public class MemberData(ISqlDataAccess sql) : IMemberData
{
    private readonly ISqlDataAccess _sql = sql;

    private static List<MemberModel> MapDataToMembers(List<MemberModel> members, MemberDataModel relatedData)
    {
        var userDictionary = relatedData.Users.ToDictionary(u => u.Id);

        var userIds = new HashSet<int>(relatedData.Users.Select(u => u.Id));

        Parallel.ForEach(members, member =>
        {
            member.Community = relatedData.Community;

            if (userIds.Contains(member.UserId))
            {
                member.User = userDictionary[member.UserId];
            }
        });

        return members;
    }

    private async Task<MemberDataModel> GetRelatedDataAsync(int communityId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", communityId);

        var communityTask = _sql.GetDataAsync<BasicCommunityModel>("dbo.spCommunity_GetById", parameters);
        var usersTask = _sql.GetAllDataAsync<UserModel>("dbo.spUser_GetAll");

        await Task.WhenAll(communityTask, usersTask);

        var data = new MemberDataModel
        {
            Community = communityTask.Result,
            Users = usersTask.Result,
        };

        return data;
    }

    public async Task<List<MemberModel>> GetAllMemberByCommunityIdAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("CommunityId", id);

        var relatedData = await GetRelatedDataAsync(id);
        var members = await _sql.GetAllDataAsync<MemberModel>("dbo.spMember_GetByCommunityId", parameters);

        var output = MapDataToMembers(members, relatedData);

        return output;
    }

    public async Task<MemberModel> GetMemberByIdAsync(int id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);

        var member = await _sql.GetDataAsync<MemberModel>("dbo.spMember_GetById", parameters);
        if (member is null)
        {
            return default;
        }

        parameters = new DynamicParameters();
        parameters.Add("Id", member?.UserId);
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

        parameters = new DynamicParameters();
        parameters.Add("Id", output.UserId);

        var user = await _sql.GetDataAsync<UserModel>("dbo.spUser_GetById", parameters);

        parameters = new DynamicParameters();
        parameters.Add("Id", output.CommunityId);

        var community = await _sql.GetDataAsync<BasicCommunityModel>("dbo.spCommunity_GetById", parameters);

        output.User = user;
        output.Community = community;

        return output;
    }

    public async Task DeleteMemberAsync(MemberModel member)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", member.Id);

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
