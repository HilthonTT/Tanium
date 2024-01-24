import { notFound } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { getSelf, getUser } from "@/lib/user-service";
import { getUserReplies } from "@/lib/reply-service";
import { ReplyCard, ReplyCardSkeleton } from "@/components/reply-card";

import { UserContainer } from "../_components/user-container";

interface CommentsPageProps {
  params: {
    userId: number;
  };
}

const CommentsPage = async ({ params }: CommentsPageProps) => {
  const otherUser = await getUser(params.userId);
  if (!otherUser) {
    return notFound();
  }

  const [self, replies] = await Promise.all([
    getSelf(),
    getUserReplies(params.userId),
  ]);

  return (
    <UserContainer self={self} otherUser={otherUser}>
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
      {replies.length === 0 && (
        <div>
          <h2 className="text-xl font-semibold uppercase">No Comments</h2>
          <Separator className="w-full my-2" />
          <div className="w-full h-full space-y-4">
            {[...Array(10)].map((_, i) => (
              <ReplyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}
    </UserContainer>
  );
};

export default CommentsPage;
