"use client";

import { ReplyCard, ReplyCardSkeleton } from "@/components/reply-card";
import { useIsClient } from "@/hooks/use-is-client";

import { NoResults } from "./no-results";

interface RepliesProps {
  replies: Reply[];
}

export const Replies = ({ replies }: RepliesProps) => {
  const isClient = useIsClient();

  if (!isClient) {
    return <RepliesSkeleton />;
  }

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <ReplyCard key={reply.id} reply={reply} />
      ))}
      {replies.length === 0 && <NoResults />}
    </div>
  );
};

export const RepliesSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(10)].map((_, i) => (
        <ReplyCardSkeleton key={i} />
      ))}
    </div>
  );
};
