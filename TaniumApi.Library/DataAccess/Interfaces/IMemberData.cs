using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess.Interfaces;
public interface IMemberData
{
    Task<MemberModel> CreateMemberAsync(MemberModel member);
    Task DeleteMemberAsync(MemberModel member);
    Task<List<MemberModel>> GetAllMemberByCommunityIdAsync(int id);
    Task<MemberModel> GetMemberByIdAsync(int id);
    Task<bool> IsMemberAsync(int userId, int communityId);
}