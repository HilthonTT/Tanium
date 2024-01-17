"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, MoveDown, MoveUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";

interface PostCardProps {
  post: Post;
  self: User | null;
}

export const PostCard = ({ post, self }: PostCardProps) => {
  const router = useRouter();

  const calculatedUpvotes = post.upvotes.length - post.downvotes.length;
  const [upvotes, setUpvotes] = useState<number>(calculatedUpvotes);

  const formattedUploadedDate = formatDistanceToNow(post.dateCreated, {
    addSuffix: true,
  });

  const onClick = () => {
    router.push(`/community/${post.communityId}/post/${post.id}`);
  };

  const onCommunityClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    router.push(`/community/${post.communityId}`);
  };

  return (
    <div
      onClick={onClick}
      className="relative bg-secondary rounded-md flex space-x-1 w-full h-full cursor-pointer border-[0.1px] hover:border-zinc-500 transition">
      <div className="bg-primary/5 flex-shrink-0 p-3">
        <div className="flex items-center justify-start flex-col space-y-2">
          <Button variant="ghost" className="p-1">
            <MoveUp className={cn("h-5 w-5 text-muted-foreground")} />
          </Button>
          <span className="text-muted-foreground">{upvotes}</span>
          <Button variant="ghost" className="p-1">
            <MoveDown className={cn("h-5 w-5 text-muted-foreground")} />
          </Button>
        </div>
      </div>
      <div className="relative w-full h-full p-1">
        <div className="flex items-center justify-start p-2 gap-x-1">
          <div className="relative" onClick={onCommunityClick}>
            <UserAvatar
              username={post.community.name}
              imageUrl={post.community.imageUrl || ""}
              size="sm"
            />
          </div>
          <p
            onClick={onCommunityClick}
            className="ml-1 text-xs font-semibold hover:underline">
            {post.community.name}
          </p>
          &middot;
          <p className="text-xs text-muted-foreground">
            Posted by {post.user.username} {formattedUploadedDate}
          </p>
        </div>
        <div className="px-2 w-full">
          <h3 className="text-lg font-bold break-words">{post.title}</h3>
          <div className="mt-4">
            <p className="text-sm">{post.description}</p>
          </div>
        </div>

        <div className="mt-4">
          <Button variant="ghost" className="text-muted-foreground">
            <MessageSquare className="mr-2" />
            <p className="text-xs">0 Comments</p>
          </Button>
        </div>
      </div>
    </div>
  );
};
