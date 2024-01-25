"use client";

import { useIsClient } from "@/hooks/use-is-client";
import { CreateCommunityModal } from "@/components/modals/create-community-modal";
import { DeletePostModal } from "@/components/modals/delete-post-modal";
import { EditCommunityBannerModal } from "@/components/modals/edit-community-banner-modal";

export const ModalProvider = () => {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return (
    <>
      <CreateCommunityModal />
      <DeletePostModal />
      <EditCommunityBannerModal />
    </>
  );
};
