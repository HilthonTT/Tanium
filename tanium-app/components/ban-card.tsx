"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { useModal } from "@/store/use-modal-store";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";

interface BanCardProps {
  ban: Ban;
  token?: string;
}

export const BanCard = ({ ban, token }: BanCardProps) => {
  const { onOpen } = useModal((state) => state);

  const onBanClick = () => {
    onOpen("unbanMember", { token, ban });
  };

  const bannerUser = ban.bannerUser;
  const bannedUser = ban.bannedUser;

  return (
    <div className="flex items-center justify-start rounded-md bg-secondary p-4">
      <div className="flex items-start justify-start">
        <UserAvatar
          username={bannedUser.username}
          imageUrl={bannedUser.imageUrl}
          size="md"
        />
        <div className="ml-2">
          <div className="flex items-start justify-start space-x-2">
            <p className="capitalize font-semibold">{bannedUser.username}</p>
          </div>

          <p className="text-xs text-muted-foreground">
            Banned by{" "}
            <Link
              href={`/user/${bannerUser.id}`}
              className="text-red-500 capitalize hover:opacity-75 transition">
              {bannerUser.username}{" "}
            </Link>
            {formatDistanceToNow(ban.dateCreated, { addSuffix: true })}
          </p>

          <div className="mt-4">
            <p className="font-bold break-words">{ban.reason}</p>
          </div>
        </div>
      </div>

      <div className="ml-auto mb-auto">
        <div className="flex items-start justify-center">
          <Button
            onClick={onBanClick}
            className="bg-red-500 hover:bg-red-400 text-white">
            Revoke Ban
          </Button>
        </div>
      </div>
    </div>
  );
};
