namespace TaniumApi.Library.Models;
public class MemberModel
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public UserModel User { get; set; }
    public int CommunityId { get; set; }
    public CommunityModel Community { get; set; }
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    public DateTime DateUpdated { get; set; }
}
