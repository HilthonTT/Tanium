namespace TaniumApi.Library.Models;
public class UpvoteModel
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public UserModel User { get; set; }
    public int PostId { get; set; }
    public BasicPostModel Post { get; set; }
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
}
