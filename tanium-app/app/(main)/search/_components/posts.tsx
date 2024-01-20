"use client";

import { PostCard } from "@/components/post-card";

import { NoResults } from "./no-results";

interface PostsProps {
  posts: Post[];
  self: User | null;
  token: string | null;
}

export const Posts = ({ posts, self, token }: PostsProps) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} self={self} token={token} />
      ))}
      {posts.length === 0 && <NoResults />}
    </div>
  );
};
