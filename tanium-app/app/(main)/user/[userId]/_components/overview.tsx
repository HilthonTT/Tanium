"use client";

import { PostCard, PostCardSkeleton } from "@/components/post-card";
import { ReplyCard } from "@/components/reply-card";
import { Separator } from "@/components/ui/separator";

interface OverviewProps {
  posts: Post[];
  upvoted: Post[];
  downvoted: Post[];
  replies: Reply[];
  self: User | null;
  token: string | null;
}

export const Overview = ({
  posts,
  upvoted,
  downvoted,
  replies,
  self,
  token,
}: OverviewProps) => {
  const hasNoContent =
    posts.length === 0 &&
    upvoted.length === 0 &&
    downvoted.length === 0 &&
    replies.length === 0;

  return (
    <div className="w-full h-full relative">
      <div className="space-y-4">
        {hasNoContent && (
          <div>
            <h2 className="text-xl font-semibold uppercase">
              This user has no content...
            </h2>
            <Separator className="w-full my-2" />
            <div className="w-full h-full space-y-4">
              {[...Array(10)].map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {posts.length !== 0 && (
          <div>
            <h2 className="text-xl font-semibold uppercase">Posts</h2>
            <Separator className="w-full my-2" />
            <div className="w-full h-full space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} self={self} token={token} />
              ))}
            </div>
          </div>
        )}

        {upvoted.length !== 0 && (
          <div>
            <h2 className="text-xl font-semibold uppercase">Upvoted</h2>
            <Separator className="w-full my-2" />
            <div className="w-full h-full space-y-4">
              {upvoted.map((post) => (
                <PostCard key={post.id} post={post} self={self} token={token} />
              ))}
            </div>
          </div>
        )}

        {downvoted.length !== 0 && (
          <div>
            <h2 className="text-xl font-semibold uppercase">Downvoted</h2>
            <Separator className="w-full my-2" />
            <div className="w-full h-full space-y-4">
              {downvoted.map((post) => (
                <PostCard key={post.id} post={post} self={self} token={token} />
              ))}
            </div>
          </div>
        )}
        {replies.length !== 0 && (
          <div>
            <h2 className="text-xl font-semibold uppercase">Comments</h2>
            <Separator className="w-full my-2" />
            <div className="w-full h-full space-y-4">
              {replies.map((reply) => (
                <ReplyCard key={reply.id} reply={reply} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
