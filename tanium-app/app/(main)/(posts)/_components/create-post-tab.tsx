"use client";

import Link from "next/link";
import qs from "query-string";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface CreatePostTabProps {
  self: User | null;
}

export const CreatePostTab = ({ self }: CreatePostTabProps) => {
  const router = useRouter();

  const onCreatePost = () => {
    router.push("/submit");
  };

  const onCreatePostWithMedia = () => {
    const url = qs.stringifyUrl({
      url: "/submit",
      query: {
        media: true,
      },
    });

    router.push(url);
  };

  return (
    <>
      {self && (
        <div className="bg-secondary rounded-md">
          <div className="flex items-center justify-center px-1.5 py-4">
            <Link
              href={`/user/${self.id}`}
              className="hover:opacity-75 transition cursor-pointer"
              aria-label="Open Profile">
              <UserAvatar
                username={self.username}
                imageUrl={self.imageUrl}
                size="md"
              />
            </Link>
            <Input
              className="w-full h-[40px] ml-2 bg-primary/10"
              placeholder="Create post"
              onClick={onCreatePost}
            />
            <div className="mx-4">
              <Hint label="Create media post" side="bottom" asChild>
                <Button
                  onClick={onCreatePostWithMedia}
                  variant="ghost"
                  className="p-0">
                  <ImageIcon className="text-muted-foreground hover:text-foreground transition" />
                </Button>
              </Hint>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const CreatePostTabSkeleton = () => {
  return (
    <div className="flex items-center justify-between  gap-x-2">
      <UserAvatarSkeleton />

      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-10" />
    </div>
  );
};
