"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, ContainerIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVote } from "@/hooks/use-vote";

interface HeaderProps {
  post: Post;
  self: User | null;
}

export const Header = ({ post, self }: HeaderProps) => {
  const {
    onUpvote,
    onDownvote,
    isLoading,
    hasUpvoted,
    hasDownvoted,
    calculatedUpvotes,
  } = useVote(post, self);

  return (
    <div className="top-3 absolute w-full">
      <div className="flex items-center justify-start space-x-2">
        <div className="flex items-center justify-start space-x-2 w-full">
          <span className="text-muted-foreground">&#124;</span>
          <Button
            disabled={isLoading}
            onClick={onUpvote}
            aria-label="Upvote"
            variant="ghost"
            className="p-1">
            <ArrowUp
              className={cn("h-6 w-6", hasUpvoted && "text-emerald-500")}
            />
          </Button>
          <span>{calculatedUpvotes}</span>
          <Button
            disabled={isLoading}
            onClick={onDownvote}
            aria-label="Downvote"
            variant="ghost"
            className="p-1">
            <ArrowDown
              className={cn("h-6 w-6", hasDownvoted && "text-red-500")}
            />
          </Button>
          <span className="text-muted-foreground">&#124;</span>
          <ContainerIcon className="h-6 w-6" />
          <h2 className="text-zinc-300 truncate text-sm">{post.title}</h2>
        </div>

        <Button
          className="ml-auto font-semibold p-1 rounded-full"
          variant="ghost"
          aria-label="Close"
          asChild>
          <Link href="/">
            <X className="h-4 w-4" />
            Close
          </Link>
        </Button>
      </div>
    </div>
  );
};
