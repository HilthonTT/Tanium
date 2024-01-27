import { auth } from "@clerk/nextjs";

import { instance } from "@/lib/axios-config";

export const isCommunityMember = async (
  communityId: number
): Promise<boolean> => {
  try {
    const { getToken } = auth();

    const token = await getToken();
    if (!token) {
      return false;
    }

    const response = await instance.get(`/api/member/isMember/${communityId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const isMember = response.data as boolean;

    return isMember;
  } catch (error) {
    console.log("[MEMBER_ISMEMBER]", error);
    return false;
  }
};

export const getCommunityMembers = async (
  communityId: number
): Promise<Member[]> => {
  try {
    const response = await instance.get(`/api/member/community/${communityId}`);
    const members = response.data as Member[];

    return members;
  } catch (error) {
    console.log("[MEMBER_GET_COMMUNITY_MEMBER]", error);
    return [];
  }
};

export const searchCommunityMembers = async (
  communityId: number,
  query: string
): Promise<Member[]> => {
  try {
    const response = await instance.get(
      `/api/member/community/${communityId}/search/${query}`
    );
    const members = response.data as Member[];

    return members;
  } catch (error) {
    console.log("[MEMBER_GET_COMMUNITY_MEMBER_SEARCH]", error);
    return [];
  }
};
