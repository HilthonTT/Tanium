"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { instance } from "@/lib/axios-config";

export const useUser = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const hasUser = pathname.includes("/user");

    if (!hasUser) {
      return;
    }

    const getCurrentUser = async () => {
      try {
        const [initialSlash, user, id] = pathname.split("/");

        const response = await instance.get(`/api/user/${id}`);
        const data = response.data as User;

        setUser(data);
      } catch (error) {
        setUser(null);
      }
    };

    getCurrentUser();
  }, [pathname]);

  return user;
};
