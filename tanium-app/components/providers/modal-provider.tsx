"use client";

import { useEffect, useState } from "react";

import { CreateCommunityModal } from "@/components/modals/create-community-modal";
import { DeletePostModal } from "@/components/modals/delete-post-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateCommunityModal />
      <DeletePostModal />
    </>
  );
};
