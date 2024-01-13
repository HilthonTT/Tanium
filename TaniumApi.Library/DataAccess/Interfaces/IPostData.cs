﻿using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess.Interfaces;
public interface IPostData
{
    Task<PostModel> CreatePostAsync(PostModel post);
    Task DeletePostAsync(int id);
    Task<PostModel> GetPostByIdAsync(int id);
    Task<List<PostModel>> GetPostsByCommunityIdAsync(int communityId);
    Task<PostModel> UpdatePostAsync(PostModel post);
}