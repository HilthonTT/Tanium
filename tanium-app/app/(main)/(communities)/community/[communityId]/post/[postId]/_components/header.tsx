"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ContainerIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { instance } from "@/lib/axios-config";
import { cn } from "@/lib/utils";

interface HeaderProps {
  post: Post;
  calculatedUpvotes: number;
  token: string | null;
  self: User | null;
}

export const Header = ({
  post,
  calculatedUpvotes: upvotesCount,
  token,
  self,
}: HeaderProps) => {
  const router = useRouter();

  const [upvotes, setUpvotes] = useState<Upvote[]>(post.upvotes);
  const [downvotes, setDownvotes] = useState<Downvote[]>(post.downvotes);
  const [calculatedUpvotes, setCalculatedUpvotes] =
    useState<number>(upvotesCount);

  const hasUpvoted = !!upvotes.find((upvote) => upvote.userId === self?.id);
  const hasDownvoted = !!downvotes.find(
    (downvote) => downvote.userId === self?.id
  );

  const [upvoted, setUpvoted] = useState<boolean>(hasUpvoted);
  const [downvoted, setDownvoted] = useState<boolean>(hasDownvoted);

  const onUpvote = async () => {
    if (!token) {
      return router.push("/sign-in");
    }

    setUpvoted(true);
    setDownvoted(false);

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
          (prevCalculatedUpvotes) => prevCalculatedUpvotes + 1
        );
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDownvote = async () => {
    if (!token) {
      return router.push("/sign-in");
    }

    setDownvoted(true);
    setUpvoted(false);

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
        setCalculatedUpvotes(upvotes.length - (downvotes.length + 1));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="top-3 absolute w-full">
      <div className="flex items-center justify-start space-x-2">
        <div className="flex items-center justify-start space-x-2 w-full">
          <span className="text-muted-foreground">&#124;</span>
          <Button
            onClick={onUpvote}
            aria-label="Upvote"
            variant="ghost"
            className="p-1">
            <ArrowUp className={cn("h-6 w-6", upvoted && "text-emerald-500")} />
          </Button>
          <span>{calculatedUpvotes}</span>
          <Button
            onClick={onDownvote}
            aria-label="Downvote"
            variant="ghost"
            className="p-1">
            <ArrowDown className={cn("h-6 w-6", downvoted && "text-red-500")} />
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
