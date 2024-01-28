"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { instance } from "@/lib/axios-config";

export const useCommunity = () => {
  const pathname = usePathname();
  const [community, setCommunity] = useState<Community | null>(null);

  useEffect(() => {
    const hasCommunity = pathname.includes("/community");
    if (!hasCommunity) {
      return;
    }

    const getCurrentCommunity = async () => {
      try {
        const [initialSlash, community, id] = pathname.split("/");

        const response = await instance.get(`/api/community/${id}`);
        const data = response.data as Community;

        setCommunity(data);
      } catch (error) {
        setCommunity(null);
      }
    };

    getCurrentCommunity();
  }, [pathname]);

  return community;
};
