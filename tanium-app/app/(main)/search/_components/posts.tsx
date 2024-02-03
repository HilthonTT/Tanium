"use client";

import { PostCard, PostCardSkeleton } from "@/components/post-card";
import { useIsClient } from "@/hooks/use-is-client";

import { NoResults } from "./no-results";

interface PostsProps {
  posts: Post[];
  self: User | null;
  token: string | null;
}

export const Posts = ({ posts, self, token }: PostsProps) => {
  const isClient = useIsClient();

  if (!isClient) {
    return <PostsSkeleton />;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} self={self} token={token} />
      ))}
      {posts.length === 0 && <NoResults />}
    </div>
  );
};

export const PostsSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(10)].map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
};
