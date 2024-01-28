import { instance } from "@/lib/axios-config";

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
) => {
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
