"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquare, Pencil, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { useModal } from "@/store/use-modal-store";

import { ReplyForm } from "./reply-form";
import { ReplyCard } from "./reply-card";

interface PostDetailsProps {
  community: Community;
  post: Post;
  replies: Reply[];
  token: string | null;
  self: User | null;
}

export const PostDetails = ({
  community,
  post,
  replies,
  token,
  self,
}: PostDetailsProps) => {
  const router = useRouter();
  const { onOpen } = useModal((state) => state);

  const onDelete = () => {
    onOpen("deletePost", { post });
  };

  const onUpdate = () => {
    router.push(`/update/${post.id}`);
  };

  return (
    <div className="rounded-md bg-secondary lg:w-full lg:h-full lg:order-first p-2">
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
  );
};
