import { auth } from "@clerk/nextjs";

import { instance } from "@/lib/axios-config";

export const getUserCommunity = async (): Promise<Community[]> => {
  try {
    const { getToken } = auth();

    const token = await getToken();

    if (!token) {
      return [];
    }

    const response = await instance.get("/api/community/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as Community[];
  } catch (error) {
    console.error("[COMMUNITY_SERVICE_USER]", error);
    return [];
  }
};

export const getCommunity = async (id: number) => {
  try {
    const response = await instance.get(`/api/community/${id}`);

    return response.data as Community;
  } catch (error) {
    console.error("[COMMUNITY_SERVICE_GET_ID]", error);
    return null;
  }
};
