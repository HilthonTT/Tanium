"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, HomeIcon, ImageIcon, UserIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { usePathname } from "next/navigation";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { stringToColor } from "@/lib/utils";
import { useModal } from "@/store/use-modal-store";
import { UserAvatar } from "@/components/user-avatar";

interface HeaderProps {
  community: Community;
  isOwner: boolean;
  token: string;
  members: Member[];
}

export const Header = ({ community, isOwner, token, members }: HeaderProps) => {
  const pathname = usePathname();
  const { onOpen } = useModal((state) => state);

  const bannerColor = stringToColor(community.name + community.id);

  const onEditBannerClick = () => {
    onOpen("editCommunityBanner", { token, community });
  };

  const onEditImageClick = () => {
    onOpen("editCommunityImage", { token, community });
  };

  const isMemberPage = pathname.includes("/settings/members");

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
            className="object-fill w-full h-full"
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
          <Hint label="Edit Image" side="bottom" asChild>
            <button
              onClick={onEditImageClick}
              className="relative hover:opacity-75 transition"
              aria-label="Edit Image">
              <UserAvatar
                username={community.name}
                imageUrl={community.imageUrl || ""}
                size="xl"
              />
              <Camera className="absolute -bottom-1 -right-1 bg-black rounded-full p-1 h-8 w-8" />
            </button>
          </Hint>
          <div className="ml-5 space-y-1">
            <p className="font-bold text-xl">{community.name}</p>
            <p className="text-muted-foreground text-xs">
              Since{" "}
              {formatDistanceToNow(community.dateCreated, {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        {!isMemberPage && (
          <Button
            className="mr-4 flex items-center justify-center hover:opacity-75 transition"
            aria-label="Manage Members"
            asChild>
            <Link
              href={`/community/${community.id}/settings/members`}
              className="gap-x-1">
              <UserIcon className="h-5 w-5" />
              <p className="font-semibold text-sm">
                Manage {members.length}{" "}
                {members.length > 1 ? "members" : "member"}
              </p>
            </Link>
          </Button>
        )}
        {isMemberPage && (
          <Button
            className="mr-4 flex items-center justify-center hover:opacity-75 transition"
            aria-label="Go to community main page"
            asChild>
            <Link href={`/community/${community.id}`} className="gap-x-1">
              <HomeIcon className="w-5 h-5" />
              <p className="font-semibold text-sm">Go to community main page</p>
            </Link>
          </Button>
        )}
      </div>
    </>
  );
};
