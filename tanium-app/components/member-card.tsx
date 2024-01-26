"use client";

import { useRouter } from "next/navigation";
import { HardHat } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { instance } from "@/lib/axios-config";

interface MemberCardProps {
  member: Member;
  community: Community;
  token?: string;
}

export const MemberCard = ({ member, community, token }: MemberCardProps) => {
  const router = useRouter();

  const isOwner = member.user.id == community.user.id;

  const onBanClick = async () => {
    try {
      const data = {
        communityId: community.id,
        userId: member.user.id,
      };

      await instance.post(`/api/ban/community`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      router.refresh();
      toast.success("User banned!");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onKickClick = async () => {
    try {
      await instance.delete(`/api/member/${member.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("User kicked!");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-start rounded-md bg-secondary p-4">
      <div className="flex items-center justify-start">
        <UserAvatar
          username={member.user.username}
          imageUrl={member.user.imageUrl}
          size="md"
        />
        <div className="ml-2">
          <div className="flex items-start justify-start space-x-2">
            <p className="capitalize font-semibold">{member.user.username}</p>
            {isOwner && (
              <div className="flex items-center justify-center text-emerald-300">
                <HardHat className="h-4 w-4 mr-2" />
                <p className="font-semibold">Owner</p>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Since {formatDistanceToNow(member.dateCreated, { addSuffix: true })}
          </p>
        </div>
      </div>
      {!isOwner && (
        <div className="ml-auto">
          <div className="space-x-2 flex items-center justify-center">
            <Button
              onClick={onKickClick}
              className="bg-orange-500 hover:bg-orange-400 text-white">
              Kick
            </Button>
            <Button
              onClick={onBanClick}
              className="bg-red-500 hover:bg-red-400 text-white">
              Ban
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
