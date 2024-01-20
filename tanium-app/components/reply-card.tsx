"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";

interface ReplyCardProps {
  reply: Reply;
}

export const ReplyCard = ({ reply }: ReplyCardProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`/community/${reply.post.communityId}/post/${reply.postId}`);
  };

  return (
    <div
      onClick={onClick}
      role="button"
      className="rounded-md bg-secondary p-2 border-[0.1px] hover:border-zinc-500 transition">
      <div className="flex items-center justify-start pb-3">
        <div className="max-w-[80%]">
          <p className="text-sm font-semibold">
            Original Post: {reply.post.title}
          </p>
          <p className="truncate text-muted-foreground text-xs">
            {reply.post.description}
          </p>
        </div>
      </div>
      <div className="px-4">
        <div className="bg-sky-900/30 p-2 rounded-lg">
          <div className="flex items-center justify-start gap-x-1">
            <UserAvatar
              username={reply.user.username}
              imageUrl={reply.user.imageUrl}
            />
            <p className="text-sm font-semibold capitalize pl-2">
              {reply.user.username}
            </p>
            &middot;
            <p className="text-muted-foreground text-xs">
              {formatDistanceToNow(reply.dateCreated, { addSuffix: true })}
            </p>
          </div>
          <div className="pt-4 opacity-85">
            <p className="text-sm">{reply.content}</p>
          </div>
        </div>
        <Button onClick={onClick} variant="link" className="text-sky-500">
          Go to thread
        </Button>
      </div>
    </div>
  );
};
