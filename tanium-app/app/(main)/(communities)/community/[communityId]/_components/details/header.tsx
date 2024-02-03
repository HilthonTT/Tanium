"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  DoorClosed,
  DoorOpen,
  ImageIcon,
  Settings,
  UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";
import { stringToColor } from "@/lib/utils";
import { instance } from "@/lib/axios-config";
import { Hint } from "@/components/hint";
import { useModal } from "@/store/use-modal-store";
import { Skeleton } from "@/components/ui/skeleton";

interface HeaderProps {
  community: Community;
  isMember: boolean;
  members: Member[];
  self: User | null;
  token: string | null;
}

export const Header = ({
  self,
  community,
  isMember,
  members,
  token,
}: HeaderProps) => {
  const router = useRouter();
  const { onOpen } = useModal((state) => state);

  const [isCommunityMember, setIsCommunityMember] = useState(
    isMember && self?.id !== community.userId
  );
  const [memberCount, setMemberCount] = useState(members.length);

  const bannerColor = stringToColor(community.name + community.id);

  const isOwner = self?.id === community.userId;
  const currentMember = members.find((member) => member.userId === self?.id);

  const onLeave = async () => {
    if (isOwner || !isCommunityMember) {
      return;
    }

    try {
      setIsCommunityMember(false);
      setMemberCount((prev) => prev - 1);

      await instance.delete(`/api/member/${currentMember?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onJoin = async () => {
    if (isOwner) {
      return;
    }

    try {
      setIsCommunityMember(true);
      setMemberCount((prev) => prev + 1);

      await instance.post(
        "/api/member",
        { communityId: community.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onSettingsClick = () => {
    if (!isOwner) {
      return;
    }

    router.push(`/community/${community.id}/settings`);
  };

  const onEditBannerClick = () => {
    onOpen("editCommunityBanner", { token, community });
  };

  const onEditImageClick = () => {
    onOpen("editCommunityImage", { token, community });
  };

  return (
    <>
      {!community.bannerUrl && (
        <div
          className="relative w-full h-32"
          style={{ backgroundColor: bannerColor }}>
          {isOwner && (
            <div className="h-full w-full relative">
              <Hint label="Edit Banner" side="left" asChild>
                <Button
                  onClick={onEditBannerClick}
                  aria-label="Edit Banner"
                  className="p-2 absolute bottom-1 right-1">
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </Hint>
            </div>
          )}
        </div>
      )}
      {community.bannerUrl && (
        <div className="relative w-full h-32">
          <Image
            src={community.bannerUrl}
            alt="Community Banner"
            className="object-fill  w-full h-full"
            fill
          />
          <Hint label="Edit Banner" side="left" asChild>
            <Button
              onClick={onEditBannerClick}
              aria-label="Edit Banner"
              className="p-2 absolute bottom-1 right-1">
              <ImageIcon className="h-5 w-5" />
            </Button>
          </Hint>
        </div>
      )}

      <div className="rounded-md rounded-t-none bg-secondary h-20 w-full flex items-center justify-between">
        <div className="max-w-3xl mx-auto flex items-center space-x-4 w-full">
          {!isOwner && (
            <UserAvatar
              username={community.name}
              imageUrl={community.imageUrl || ""}
              size="xl"
            />
          )}

          {isOwner && (
            <button
              onClick={onEditImageClick}
              className="hover:opacity-75 transition z-[100]"
              aria-label="Edit Image">
              <UserAvatar
                username={community.name}
                imageUrl={community.imageUrl || ""}
                size="xl"
              />
            </button>
          )}

          <div className="ml-5 space-y-1 space-x">
            <p className="font-bold text-xl">{community.name}</p>
            <p className="text-muted-foreground text-xs">
              Since{" "}
              {formatDistanceToNow(community.dateCreated, {
                addSuffix: true,
              })}
            </p>
          </div>
          {isCommunityMember && (
            <Button onClick={onLeave} className="rounded-full font-semibold">
              <DoorOpen className="h-6 w-6 mr-2" />
              Leave
            </Button>
          )}
          {!isCommunityMember && !isOwner && (
            <Button onClick={onJoin} className="rounded-full font-semibold">
              <DoorClosed className="h-6 w-6 mr-2" />
              Join
            </Button>
          )}
          {isOwner && (
            <Button
              onClick={onSettingsClick}
              className="rounded-full font-semibold">
              <Settings className="h-6 w-6 mr-2" />
              Settings
            </Button>
          )}
        </div>
        <div className="mr-4 flex gap-x-1 items-center justify-center">
          <UserIcon />
          <p className="text-muted-foreground text-sm">
            {memberCount} {memberCount > 1 ? "members" : "member"}
          </p>
        </div>
      </div>
    </>
  );
};

export const HeaderSkeleton = () => {
  return (
    <div className="w-full p-2 relative space-y-2">
      <Skeleton className="w-full h-32" />

      <div className="max-w-3xl mx-auto flex items-center space-x-4 w-full h-full">
        <div className="absolute top-20 -bottom-2 z-[100]">
          <div className="flex items-center justify-center space-x-2">
            <UserAvatarSkeleton size="xl" className="bg-zinc-300" />
            <div className="space-y-2 top-1">
              <Skeleton className="h-5 w-20 bg-white mb-2" />
              <Skeleton className="h-5 w-40 bg-white mb-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
