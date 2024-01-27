"use client";

import { useIsClient } from "@/hooks/use-is-client";
import { CreateCommunityModal } from "@/components/modals/create-community-modal";
import { DeletePostModal } from "@/components/modals/delete-post-modal";
import { EditCommunityBannerModal } from "@/components/modals/edit-community-banner-modal";
import { EditCommunityImageModal } from "@/components/modals/edit-community-image-modal";
import { BanMemberModal } from "@/components/modals/ban-member-modal";
import { KickMemberModal } from "@/components/modals/kick-member-modal";

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
      <EditCommunityImageModal />
      <BanMemberModal />
      <KickMemberModal />
    </>
  );
};
