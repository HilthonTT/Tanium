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
