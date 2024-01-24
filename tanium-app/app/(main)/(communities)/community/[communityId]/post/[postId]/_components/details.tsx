"use client";

import qs from "query-string";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MessageSquare, Pencil, Trash } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

import { useModal } from "@/store/use-modal-store";
import { UserAvatar } from "@/components/user-avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { stringToColor } from "@/lib/utils";

import { ReplyForm } from "./reply-form";
import { ReplyCard } from "./reply-card";

interface DetailsProps {
  post: Post;
  community: Community;
  replies: Reply[];
  self: User | null;
  token: string | null;
}

export const Details = ({
  post,
  community,
  replies,
  self,
  token,
}: DetailsProps) => {
  const router = useRouter();
  const { onOpen } = useModal((state) => state);

  const bannerColor = stringToColor(community.name + community.id);

  const onCreatePost = () => {
    const url = qs.stringifyUrl({
      url: "/submit",
      query: {
        communityId: community.id,
      },
    });

    router.push(url);
  };

  const onDelete = () => {
    onOpen("deletePost", { post });
  };

  const onUpdate = () => {
    router.push(`/update/${post.id}`);
  };

  return (
    <div className="relative w-full h-full flex items-start justify-start space-x-3">
      <div className="rounded-md bg-secondary p-2 w-full h-full">
        <div className="flex items-center justify-start gap-x-1">
          <UserAvatar
            username={community.name}
            imageUrl={community.imageUrl || ""}
          />
          <Link
            href={`/community/${community.id}`}
            className="font-semibold truncate hover:underline text-sm">
            {community.name}
          </Link>
          &middot;
          <p className="text-xs text-muted-foreground">
            Posted by {post.user.username}{" "}
            {formatDistanceToNow(post.dateCreated, { addSuffix: true })}
          </p>
        </div>
        <div className="pt-2 space-y-2 flex w-full">
          <div className="flex flex-col items-start justify-start w-full">
            <h1 className="font-semibold text-lg">{post.title}</h1>
            <p className="text-sm break-words">{post.description}</p>
          </div>
          {post.imageUrl && (
            <div className="h-24 w-24 relative">
              <Image
                src={post.imageUrl}
                className="object-cover rounded-md"
                alt="Image"
                fill
              />
            </div>
          )}
        </div>
        <div className="pt-8">
          <div className="flex items-center justify-start space-x-2">
            <div className="flex items-center justify-center gap-x-1">
              <MessageSquare className="text-muted-foreground h-5 w-5" />
              <p className="text-muted-foreground font-semibold text-xs">
                {replies.length} {replies.length > 1 ? "comments" : "comment"}
              </p>
            </div>

            <Button
              onClick={onDelete}
              variant="ghost"
              className="flex items-center justify-center gap-x-1 hover:opacity-75 transition p-2">
              <Trash className="text-muted-foreground h-5 w-5" />
              <p className="text-muted-foreground font-semibold text-xs">
                Delete
              </p>
            </Button>

            <Button
              onClick={onUpdate}
              variant="ghost"
              className="flex items-center justify-center gap-x-1 hover:opacity-75 transition p-2">
              <Pencil className="text-muted-foreground h-5 w-5" />
              <p className="text-muted-foreground font-semibold text-xs">
                Update
              </p>
            </Button>
          </div>
          {!!self && (
            <div className="pt-5">
              <ReplyForm token={token} postId={post.id} self={self} />
            </div>
          )}
          <div className="pt-5 space-y-2 ">
            {replies.map((reply) => (
              <ReplyCard key={reply.id} reply={reply} />
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-md bg-secondary w-96 relative">
        <div
          className="w-full rounded-md rounded-b-none h-10"
          style={{ backgroundColor: bannerColor }}
        />
        <div className="pt-3 p-2">
          <div className="flex items-center justify-start gap-x-2">
            <UserAvatar
              username={community.name}
              imageUrl={community.imageUrl || ""}
            />
            <Link
              href={`/community/${community.id}`}
              className="font-semibold truncate hover:underline">
              {community.name}
            </Link>
          </div>
          <div className="w-full pt-2">
            <div className="max-w-[80%]">
              <p className="break-words text-sm">{community.description}</p>
            </div>
            <div className="flex items-center justify-start pt-4">
              <Calendar className="h-6 w-6 mr-2" />
              <p className="text-muted-foreground text-sm">
                Created {format(community.dateCreated, "MMMM dd, yyyy")}
              </p>
            </div>
            <Separator className="my-4 bg-primary/30" />
            <Button
              onClick={onCreatePost}
              className="rounded-full font-semibold w-full">
              Create Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
