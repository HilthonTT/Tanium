"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "./ui/skeleton";

interface ReplyCardProps {
  reply: Reply;
  size?: "sm" | "md" | "lg" | "xl" | "default";
}

export const ReplyCard = ({ reply, size = "default" }: ReplyCardProps) => {
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
              size={size}
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

export const ReplyCardSkeleton = () => {
  return (
    <div className="rounded-md bg-secondary/20 w-full h-full p-2">
      <div className="mx-6 space-y-2">
        <Skeleton className="w-full h-5" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-20 h-5" />
      </div>
    </div>
  );
};
