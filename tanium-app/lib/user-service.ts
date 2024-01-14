import { auth } from "@clerk/nextjs";

import { instance } from "@/lib/axios-config";

export const getSelf = async () => {
  try {
    const { getToken } = auth();

    const token = await getToken();
    if (!token) {
      return null;
    }

    const response = await instance.get("/api/User/auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as User;
  } catch (error) {
    console.error("[USER_SERVICE_SELF]", error);
    return null;
  }
};
