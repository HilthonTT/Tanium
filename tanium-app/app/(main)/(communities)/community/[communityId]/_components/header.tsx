"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { DoorClosed, DoorOpen, Settings, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { stringToColor } from "@/lib/utils";
import { instance } from "@/lib/axios-config";

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

  const onSettings = () => {
    router.push(`/community/${community.id}/settings`);
  };

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
                  Since{" "}
                  {formatDistanceToNow(community.dateCreated, {
                    addSuffix: true,
                  })}
                </p>
              </div>
              {isCommunityMember && (
                <Button
                  onClick={onLeave}
                  className="rounded-full font-semibold">
                  <DoorOpen className="h-6 w-6 mr-2" />
                  Leave
                </Button>
              )}
              {!isCommunityMember && (
                <Button onClick={onJoin} className="rounded-full font-semibold">
                  <DoorClosed className="h-6 w-6 mr-2" />
                  Join
                </Button>
              )}
              {isOwner && (
                <Button
                  onClick={onSettings}
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
      )}
    </>
  );
};
