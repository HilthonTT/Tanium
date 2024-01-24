namespace TaniumApi.Library.Models;
public class PostDataModel
{
    public List<BasicCommunityModel> Communities { get; set; } = [];
    public List<UserModel> Users { get; set; } = [];
    public List<DownvoteModel> Downvotes { get; set; } = [];
    public List<UpvoteModel> Upvotes { get; set; } = [];
    public List<ReplyModel> Replies { get; set; } = [];
}
