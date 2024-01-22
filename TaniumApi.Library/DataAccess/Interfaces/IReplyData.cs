using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess.Interfaces;
public interface IReplyData
{
    Task<ReplyModel> CreateReplyAsync(ReplyModel reply);
    Task DeleteReplyAsync(ReplyModel reply);
    Task<List<ReplyModel>> GetAllRepliesAsync();
    Task<List<ReplyModel>> GetRepliesByPostIdAsync(int id);
    Task<ReplyModel> GetReplyByIdAsync(int id);
    Task<ReplyModel> UpdateReplyAsync(ReplyModel reply);
}