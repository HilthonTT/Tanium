import { auth } from "@clerk/nextjs";

import { instance } from "@/lib/axios-config";

export const getCommunities = async (): Promise<Community[]> => {
  try {
    const response = await instance.get("/api/community");

    return response.data as Community[];
  } catch (error) {
    console.error("[COMMUNITY_SERVICE_GET_ALL]", error);
    return [];
  }
};

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

export const getCommunity = async (id: number): Promise<Community | null> => {
  try {
    const response = await instance.get(`/api/community/${id}`);

    return response.data as Community;
  } catch (error) {
    console.error("[COMMUNITY_SERVICE_GET_ID]", error);
    return null;
  }
};

export const searchCommunities = async (
  query: string
): Promise<Community[]> => {
  try {
    const response = await instance.get(`/api/community/search/${query}`);

    return response.data as Community[];
  } catch (error) {
    console.error("[COMMUNITY_SERVICE_SEARCH]", error);
    return [];
  }
};

export const isAllowedToCreateCommunity = async () => {
  try {
    const { getToken } = auth();
    const token = await getToken();

    if (!token) {
      return false;
    }

    const response = await instance.get("/api/community/IsAllowedToCreate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as boolean;
  } catch (error) {
    console.error("[COMMUNITY_SERVICE_ALLOWED]", error);
    return false;
  }
};
