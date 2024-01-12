namespace TaniumApi.Library.Models;
public class PostModel
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public int UserId { get; set; }
    public UserModel User { get; set; }
    public int CommunityId { get; set; }
    public CommunityModel Community { get; set; }
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    public DateTime DateUpdated { get; set; }
}
