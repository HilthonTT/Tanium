﻿using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess.Interfaces;
public interface IReplyData
{
    Task<ReplyModel> CreateReplyAsync(ReplyModel reply);
    Task DeleteReplyAsync(int id);
    Task<List<ReplyModel>> GetRepliesByPostIdAsync(int id);
    Task<ReplyModel> GetReplyByIdAsync(int id);
    Task<ReplyModel> UpdateReplyAsync(ReplyModel reply);
}