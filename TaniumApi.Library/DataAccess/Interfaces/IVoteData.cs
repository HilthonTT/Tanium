using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess.Interfaces;
public interface IVoteData
{
    Task<UpvoteModel> CreateDownvoteAsync(int userId, int postId);
    Task<UpvoteModel> CreateUpvoteAsync(int userId, int postId);
    Task DeleteDownvoteAsync(int userId, int postId);
    Task DeleteUpvoteAsync(int userId, int postId);
    Task<UpvoteModel> GetDownvoteByUserIdAndPostIdAsync(int userId, int postId);
    Task<UpvoteModel> GetUpvoteByUserIdAndPostIdAsync(int userId, int postId);
}