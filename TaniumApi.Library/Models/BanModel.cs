namespace TaniumApi.Library.Models;
public class BanModel
{
    public int Id { get; set; }
    public string Reason { get; set; }
    public int CommunityId { get; set; }
    public CommunityModel Community { get; set; }
    public int BannedUserId { get; set; }
    public UserModel BannedUser { get; set; }
    public int BannerUserId { get; set; }
    public UserModel? BannerUser { get; set; }
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
}
