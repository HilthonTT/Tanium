import { instance } from "@/lib/axios-config";

export const getPosts = async () => {
  try {
    const response = await instance.get("/api/post");

    return response.data as Post[];
  } catch (error) {
    console.log("[POST_SERVICE_GET]", error);
    return [];
  }
};

export const getHotPosts = async () => {
  try {
    const response = await instance.get("/api/post/hot");

    return response.data as Post[];
  } catch (error) {
    console.log("[POST_SERVICE_GET_HOT]", error);
    return [];
  }
};

export const getBestPosts = async () => {
  try {
    const response = await instance.get("/api/post/best");

    return response.data as Post[];
  } catch (error) {
    console.log("[POST_SERVICE_GET_BEST]", error);
    return [];
  }
};

export const getCommunityPosts = async (communityId: number) => {
  try {
    const response = await instance.get(`/api/post/community/${communityId}`);

    return response.data as Post[];
  } catch (error) {
    console.log("[POST_SERVICE_GET_COMMUNITY_POSTS]", error);
    return [];
  }
};

export const getHotCommunityPosts = async (communityId: number) => {
  try {
    const response = await instance.get(
      `/api/post/community/hot/${communityId}`
    );

    return response.data as Post[];
  } catch (error) {
    console.log("[POST_SERVICE_GET_COMMUNITY_POSTS_HOT]", error);
    return [];
  }
};

export const getBestCommunityPosts = async (communityId: number) => {
  try {
    const response = await instance.get(
      `/api/post/community/best/${communityId}`
    );

    return response.data as Post[];
  } catch (error) {
    console.log("[POST_SERVICE_GET_COMMUNITY_POSTS_BEST]", error);
    return [];
  }
};

export const searchPosts = async (query: string) => {
  try {
    const response = await instance.get(`/api/post/search/${query}`);

    return response.data as Post[];
  } catch (error) {
    console.log("[POST_SERVICE_SEARCH]", error);
    return [];
  }
};

export const getPost = async (id: number) => {
  try {
    const response = await instance.get(`/api/post/${id}`);

    return response.data as Post;
  } catch (error) {
    console.log("[POST_SERVICE_GET_ID]", error);
    return null;
  }
};

export const getUserPosts = async (userId: number) => {
  try {
    const response = await instance.get(`/api/post/user/${userId}`);

    return response.data as Post[];
  } catch (error) {
    console.log("[POST_SERVICE_GET_USER]", error);
    return [];
  }
};

export const getUpvotedPosts = async (userId: number) => {
  try {
    const response = await instance.get(`/api/post/user/${userId}/upvoted`);

    return response.data as Post[];
  } catch (error) {
    console.log("[POST_SERVICE_GET_USER_UPVOTED]", error);
    return [];
  }
};

export const getDownvotedPosts = async (userId: number) => {
  try {
    const response = await instance.get(`/api/post/user/${userId}/downvoted`);

    return response.data as Post[];
  } catch (error) {
    console.log("[POST_SERVICE_GET_USER_DOWNVOTED]", error);
    return [];
  }
};
