"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Home, ShieldPlus } from "lucide-react";
import { CreatePostTab } from "./create-post-tab";
import { PostCard } from "./post-card";
import { useModal } from "@/store/use-modal-store";

interface PostsProps {
  posts: Post[];
  self: User | null;
  token: string | null;
}

export const Posts = ({ posts, self, token }: PostsProps) => {
  const router = useRouter();
  const { onOpen } = useModal((state) => state);

  const onCreatePost = () => {
    router.push("/submit");
  };

  const onCreateCommunity = () => {
    onOpen("createCommunity", { token });
  };

  return (
    <div className="mt-4 flex space-x-2">
      <div className="flex-1 space-y-4 ">
        <div className="space-y-4">
          <CreatePostTab self={self} />
          {posts.map((post) => (
            <PostCard key={post.id} post={post} self={self} />
          ))}
        </div>
      </div>

      <div className="w-1/4 space-y-2">
        <div className="rounded-md p-2 bg-secondary">
          <div className="flex items-center mb-2">
            <ShieldPlus className="h-8 w-8 text-emerald-500" />
            <div className="flex flex-col ml-2">
              <p className="text-sm font-semibold">Tanium Premium</p>
              <p className="text-xs">The best Tanium experience</p>
            </div>
          </div>
          <Button variant="premium" className="rounded-full w-full">
            Try now
          </Button>
        </div>

        <div className="rounded-md p-2 bg-secondary">
          <div className="flex items-center">
            <Home className="text-emerald-500 h-8 w-8 mr-2" />
            <p className="font-semibold">Home</p>
          </div>
          <p className="text-sm mt-2 font-semibold">
            Your personalized Tanium page
          </p>

          <Separator className="my-4 bg-primary/30" />

          <div className="space-y-2 flex flex-col">
            <Button onClick={onCreatePost} className="rounded-full font-bold">
              Create Post
            </Button>
            <Button
              onClick={onCreateCommunity}
              variant="outline"
              className="rounded-full font-bold border-white bg-secondary hover:bg-background/10">
              Create Community
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
