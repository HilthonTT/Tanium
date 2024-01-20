"use client";

import { UserAvatar } from "@/components/user-avatar";

interface ReplyCardProps {
  reply: Reply;
}

export const ReplyCard = ({ reply }: ReplyCardProps) => {
  return (
    <div className="rounded-md bg-primary/10 p-2">
      <div className="flex items-start justify-start">
        <UserAvatar
          username={reply.user.username}
          imageUrl={reply.user.imageUrl}
        />
        <p className="text-sm font-semibold truncate ml-2">
          {reply.user.username}
        </p>
      </div>
      <div className="text-sm font-semibold pt-2">{reply.content}</div>
    </div>
  );
};
