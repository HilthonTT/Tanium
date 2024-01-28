import { instance } from "@/lib/axios-config";
import { auth } from "@clerk/nextjs";

export const getCommunityBans = async (
  token: string,
  communityId: number
): Promise<Ban[]> => {
  try {
    const response = await instance.get(`/api/ban/community/${communityId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as Ban[];
  } catch (error) {
    console.log("[BAN_SERVICE_GET_COMMUNITY]", error);
    return [];
  }
};

export const searchCommunityBans = async (
  token: string,
  communityId: number,
  query: string
): Promise<Ban[]> => {
  try {
    const response = await instance.get(
      `/api/ban/community/${communityId}/search/${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data as Ban[];
  } catch (error) {
    console.log("[BAN_SERVICE_GET_COMMUNITY_SEARCH]", error);
    return [];
  }
};

export const isCommunityBanned = async (
  communityId: number
): Promise<boolean> => {
  try {
    const { getToken } = auth();

    const token = await getToken();
    if (!token) {
      return false;
    }

    const response = await instance.get(`/api/ban/isBanned/${communityId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as boolean;
  } catch (error) {
    console.log("[BAN_SERVICE_IS_BANNED]", error);
    return false;
  }
};
