import { auth } from "@clerk/nextjs";

import { instance } from "@/lib/axios-config";

export const getUserCommunity = async () => {
  try {
    const { getToken } = auth();

    const token = await getToken();

    if (!token) {
      return null;
    }

    const response = await instance.get("/api/community/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as community[];
  } catch (error) {
    console.error("[COMMUNITY_SERVICE_USER]", error);
    return null;
  }
};
