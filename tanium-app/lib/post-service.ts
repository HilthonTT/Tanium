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
