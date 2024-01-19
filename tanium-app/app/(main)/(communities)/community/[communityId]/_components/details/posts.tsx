"use client";

import qs from "query-string";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PostCard } from "@/components/post-card";

import { CreatePostTab } from "./create-post-tab";
import { FilterTab } from "./filter-tab";

interface PostsProps {
  posts: Post[];
  self: User | null;
  token: string | null;
  community: Community;
}

export const Posts = ({ posts, self, token, community }: PostsProps) => {
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

  return (
    <div className="pt-4 flex space-x-2">
      <div className="flex-1 space-y-4">
        <div className="space-y-4">
          <CreatePostTab self={self} community={community} />
          <FilterTab communityId={community.id} />
          {posts.map((post) => (
            <PostCard key={post.id} post={post} token={token} self={self} />
          ))}
        </div>
      </div>

      <div className="w-1/4 space-y-2">
        <div className="rounded-md p-2 bg-secondary">
          <h2 className="text-muted-foreground text-sm font-semibold">
            About Community
          </h2>
          <div className="pt-2 space-y-5">
            <p className="text-sm break-words">{community.description}</p>
            <div className="flex items-center justify-start">
              <Calendar className="h-6 w-6 mr-2" />
              <p className="text-muted-foreground text-sm">
                Created {format(community.dateCreated, "MMMM dd, yyyy")}
              </p>
            </div>
            <Separator className="my-4 bg-primary/30" />
            <Button
              onClick={onCreatePost}
              className="rounded-full  font-semibold w-full">
              Create Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
