"use client";

import qs from "query-string";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/user-avatar";

interface CreatePostTabProps {
  self: User | null;
  community: Community;
}

export const CreatePostTab = ({ self, community }: CreatePostTabProps) => {
  const router = useRouter();

  const onCreatePost = () => {
    const url = qs.stringifyUrl({
      url: "/submit",
      query: {
        communityId: community.id,
      },
    });

    router.push(url);
  };

  const onCreatePostWithMedia = () => {
    const url = qs.stringifyUrl({
      url: "/submit",
      query: {
        media: true,
        communityId: community.id,
      },
    });

    router.push(url);
  };

  return (
    <>
      {self && (
        <div className="bg-secondary rounded-md">
          <div className="flex items-center justify-center px-1.5 py-4">
            <UserAvatar
              username={self.username}
              imageUrl={self.imageUrl}
              size="md"
            />
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
