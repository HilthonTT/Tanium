"use client";

import { ReplyCard } from "@/components/reply-card";

import { NoResults } from "./no-results";

interface RepliesProps {
  replies: Reply[];
}

export const Replies = ({ replies }: RepliesProps) => {
  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <ReplyCard key={reply.id} reply={reply} />
      ))}
      {replies.length === 0 && <NoResults />}
    </div>
  );
};
