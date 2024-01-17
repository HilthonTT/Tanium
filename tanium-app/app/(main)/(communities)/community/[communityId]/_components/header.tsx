"use client";

import { formatDistanceToNow } from "date-fns";
import { DoorClosed, DoorOpen, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { stringToColor } from "@/lib/utils";

interface HeaderProps {
  community: Community;
  isMember: boolean;
  members: Member[];
}

export const Header = ({ community, isMember, members }: HeaderProps) => {
  const bannerColor = stringToColor(community.name + community.id);

  const dateJoined = formatDistanceToNow(community.dateCreated, {
    addSuffix: true,
  });

  return (
    <>
      {!community.bannerUrl && (
        <>
          <div
            className="w-full h-32"
            style={{ backgroundColor: bannerColor }}
          />
          <div className="rounded-md rounded-t-none bg-secondary h-20 w-full flex items-center justify-between">
            <div className="max-w-3xl mx-auto flex items-center space-x-4 w-full">
              <UserAvatar
                username={community.name}
                imageUrl={community.imageUrl || ""}
                size="xl"
              />
              <div className="ml-5 space-y-1 space-x">
                <p className="font-bold text-xl">{community.name}</p>
                <p className="text-muted-foreground text-xs">
                  Since {dateJoined}
                </p>
              </div>
              {isMember && (
                <Button className="rounded-full font-semibold">
                  <DoorOpen className="h-6 w-6 mr-2" />
                  Leave
                </Button>
              )}
              {!isMember && (
                <Button className="rounded-full font-semibold">
                  <DoorClosed className="h-6 w-6 mr-2" />
                  Join
                </Button>
              )}
            </div>
            <div className="mr-4 flex gap-x-1 items-center justify-center">
              <UserIcon />
              <p className="text-muted-foreground text-sm">
                {members.length} {members.length > 1 ? "members" : "member"}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};
