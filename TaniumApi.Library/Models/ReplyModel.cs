namespace TaniumApi.Library.Models;
public class ReplyModel
{
    public int Id { get; set; }
    public string Content { get; set; }
    public int UserId { get; set; }
    public UserModel User { get; set; }
    public int PostId { get; set; }
    public BasicPostModel Post { get; set; }
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    public DateTime DateUpdated { get; set; }
}
