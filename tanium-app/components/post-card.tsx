"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, MoveDown, MoveUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { instance } from "@/lib/axios-config";
import { UserAvatar } from "@/components/user-avatar";

interface PostCardProps {
  post: Post;
  token: string | null;
  self: User | null;
}

export const PostCard = ({ post, token, self }: PostCardProps) => {
  const router = useRouter();

  const [upvotes, setUpvotes] = useState<Upvote[]>(post.upvotes);
  const [downvotes, setDownvotes] = useState<Downvote[]>(post.downvotes);
  const [calculatedUpvotes, setCalculatedUpvotes] = useState<number>(
    post.upvotes.length - post.downvotes.length
  );

  const hasUpvoted = !!upvotes.find((upvote) => upvote.userId === self?.id);
  const hasDownvoted = !!downvotes.find(
    (downvote) => downvote.userId === self?.id
  );

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

  const onUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const response = await instance.post(
        `/api/vote/upvote/${post.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const upvote = response.data as Upvote;

      // Check if the user has already upvoted
      const upvoteIndex = upvotes.findIndex((u) => u.userId === upvote.userId);

      if (upvoteIndex !== -1) {
        // Remove the upvote
        const newUpvotes = [...upvotes];
        newUpvotes.splice(upvoteIndex, 1);
        setUpvotes(newUpvotes);

        // Update calculatedUpvotes
        setCalculatedUpvotes(
          (prevCalculatedUpvotes) => prevCalculatedUpvotes - 1
        );
      } else {
        // Add the upvote
        setUpvotes([...upvotes, upvote]);

        // Update calculatedUpvotes
        setCalculatedUpvotes(
          (prevCalculatedUpvotes) => prevCalculatedUpvotes + 2
        );
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDownvote = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const response = await instance.post(
        `/api/vote/downvote/${post.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const downvote = response.data as Downvote;

      // Check if the user has already downvoted
      const downvoteIndex = downvotes.findIndex(
        (d) => d.userId === downvote.userId
      );

      if (downvoteIndex !== -1) {
        // Remove the downvote
        const newDownvotes = [...downvotes];
        newDownvotes.splice(downvoteIndex, 1);
        setDownvotes(newDownvotes);

        // Update calculatedUpvotes
        setCalculatedUpvotes(upvotes.length - newDownvotes.length);
      } else {
        // Add the downvote
        setDownvotes([...downvotes, downvote]);

        // Update calculatedUpvotes
        setCalculatedUpvotes(upvotes.length - (downvotes.length + 2));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      onClick={onClick}
      className="relative bg-secondary rounded-md flex space-x-1 w-full h-full cursor-pointer border-[0.1px] hover:border-zinc-500 transition">
      <div className="bg-primary/5 flex-shrink-0 p-3">
        <div className="flex items-center justify-start flex-col space-y-2">
          <Button onClick={onUpvote} variant="ghost" className="p-1">
            <MoveUp
              className={cn(
                "h-5 w-5 text-muted-foreground",
                hasUpvoted && "text-emerald-500"
              )}
            />
          </Button>
          <span className="text-muted-foreground">{calculatedUpvotes}</span>
          <Button onClick={onDownvote} variant="ghost" className="p-1">
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
        <div className="mt-4">
          <Button variant="ghost" className="text-muted-foreground">
            <MessageSquare className="mr-2" />
            <p className="text-xs">{post.replies.length} Comments</p>
          </Button>
        </div>
      </div>
      <div className="p-1">
        {post.imageUrl && (
          <div className="relative h-40 w-40">
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
