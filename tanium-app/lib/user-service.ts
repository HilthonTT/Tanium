import { auth } from "@clerk/nextjs";

import { instance } from "@/lib/axios-config";

export const getSelf = async () => {
  try {
    const { getToken } = auth();

    const token = await getToken();
    if (!token) {
      return null;
    }

    const response = await instance.get("/api/user/auth", {
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

export const getUsers = async () => {
  try {
    const response = await instance.get("/api/user");

    return response.data as User[];
  } catch (error) {
    console.error("[USER_SERVICE_GET_ALL]", error);
    return [];
  }
};

export const searchUsers = async (query: string) => {
  try {
    const response = await instance.get(`/api/user/${query}`);

    return response.data as User[];
  } catch (error) {
    console.error("[USER_SERVICE_SEARCH]", error);
    return [];
  }
};

export const getUser = async (id: number) => {
  try {
    const response = await instance.get(`/api/user/${id}`);

    return response.data as User;
  } catch (error) {
    console.error("[USER_SERVICE_GET_ALL]", error);
    return null;
  }
};
