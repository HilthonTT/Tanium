import { instance } from "@/lib/axios-config";

export const getReplies = async () => {
  try {
    const response = await instance.get("/api/reply");

    return response.data as Reply[];
  } catch (error) {
    console.log("[REPLY_SERVICE_GET_ALL]", error);
    return [];
  }
};

export const searchReplies = async (query: string) => {
  try {
    const response = await instance.get(`/api/reply/search/${query}`);

    return response.data as Reply[];
  } catch (error) {
    console.log("[REPLY_SERVICE_GET_SEARCH]", error);
    return [];
  }
};

export const getPostReplies = async (postId: number) => {
  try {
    const response = await instance.get(`/api/reply/post/${postId}`);

    return response.data as Reply[];
  } catch (error) {
    console.log("[REPLY_SERVICE_GET_POST_REPLIES]", error);
    return [];
  }
};
