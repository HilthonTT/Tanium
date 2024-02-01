import { auth } from "@clerk/nextjs";

import { instance } from "@/lib/axios-config";

const getUserSubscription = async (): Promise<Subscription | null> => {
  try {
    const { getToken } = auth();
    const token = await getToken();
    if (!token) {
      return null;
    }

    const response = await instance.get("/api/stripe/auth/subscription", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as Subscription;
  } catch (error) {
    console.log("[SUBSCRIPTION_USER]", error);
    return null;
  }
};

export const isPro = async (): Promise<boolean> => {
  const subscription = await getUserSubscription();

  return !!subscription;
};
