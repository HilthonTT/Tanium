import { auth } from "@clerk/nextjs";

import { instance } from "@/lib/axios-config";

export const getPersonalSettings = async (): Promise<UserSettings | null> => {
  try {
    const { getToken } = auth();

    const token = await getToken();
    if (!token) {
      return null;
    }

    const response = await instance.get("/api/usersettings/auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as UserSettings;
  } catch (error) {
    console.log("[SETTINGS_SERVICE_PERSONAL]", error);
    return null;
  }
};

export const getUserSettings = async (userId: number) => {
  try {
    const { getToken } = auth();

    const token = await getToken();
    if (!token) {
      return null;
    }

    const response = await instance.get(`/api/usersettings/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as UserSettings;
  } catch (error) {
    console.log("[SETTINGS_SERVICE_USER]", error);
    return null;
  }
};
