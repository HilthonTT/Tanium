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
