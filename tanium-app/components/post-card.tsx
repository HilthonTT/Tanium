"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, MoveDown, MoveUp, Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { useModal } from "@/store/use-modal-store";
import { Skeleton } from "@/components/ui/skeleton";
import { useVote } from "@/hooks/use-vote";

interface PostCardProps {
  post: Post;
  token: string | null;
  self: User | null;
}

export const PostCard = ({ post, token, self }: PostCardProps) => {
  const router = useRouter();
  const { onOpen } = useModal((state) => state);

  const {
    onUpvote,
    onDownvote,
    isLoading,
    hasUpvoted,
    hasDownvoted,
    calculatedUpvotes,
  } = useVote(post, self);

  const formattedUploadedDate = formatDistanceToNow(post.dateCreated, {
    addSuffix: true,
  });

  const isOwner = post.userId === self?.id;

  const onClick = () => {
    router.push(`/community/${post.communityId}/post/${post.id}`);
  };

  const onCommunityClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    router.push(`/community/${post.communityId}`);
  };

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    onOpen("deletePost", { token, post });
  };

  const onUpdate = (e: React.MouseEvent) => {
    e.stopPropagation();

    router.push(`/update/${post.id}`);
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-secondary rounded-md flex space-x-1 w-full h-full cursor-pointer border-[0.1px] hover:border-zinc-500 transition">
      <div className="bg-primary/5 flex-shrink-0 p-3">
        <div className="flex items-center justify-start flex-col space-y-2 ">
          <Button
            disabled={isLoading}
            onClick={onUpvote}
            variant="ghost"
            className="p-1">
            <MoveUp
              className={cn(
                "h-5 w-5 text-muted-foreground",
                hasUpvoted && "text-emerald-500"
              )}
            />
          </Button>
          <span className="text-muted-foreground">{calculatedUpvotes}</span>
          <Button
            disabled={isLoading}
            onClick={onDownvote}
            variant="ghost"
            className="p-1">
            <MoveDown
              className={cn(
                "h-5 w-5 text-muted-foreground",
                hasDownvoted && "text-red-500"
              )}
            />
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
        <div className="mt-4 gap-x-1">
          <Button variant="ghost" className="text-muted-foreground">
            <MessageSquare className="mr-2 h-5 w-5" />
            <p className="text-xs font-semibold">
              {post.replies.length} Comments
            </p>
          </Button>
          {isOwner && (
            <>
              <Button
                onClick={onDelete}
                variant="ghost"
                className="text-muted-foreground">
                <Trash className="h-5 w-5 mr-2" />
                <p className="text-xs font-semibold">Remove</p>
              </Button>
              <Button
                onClick={onUpdate}
                variant="ghost"
                className="text-muted-foreground">
                <Pencil className="h-5 w-5 mr-2" />
                <p className="text-xs font-semibold">Update</p>
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="p-1 mt-auto">
        {post.imageUrl && (
          <div className="relative h-20 w-20 md:h-32 md:w-32 lg:h-40 lg:w-40">
            <Image
              src={post.imageUrl}
              alt="Image"
              className="object-cover rounded-md"
              fill
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const PostCardSkeleton = () => {
  const random = Math.random();

  return (
    <div className="w-full h-full rounded-md bg-secondary/20 p-2">
      <div className="space-y-4">
        <Skeleton className="w-full h-5" />
        <Skeleton
          className={cn("w-24 h-10", random < 0.5 ? "ml-auto" : "mr-auto")}
        />
        <Skeleton className="w-full h-20" />
      </div>
    </div>
  );
};
