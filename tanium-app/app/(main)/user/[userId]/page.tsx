import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { Frown } from "lucide-react";

import { getSelf, getUser } from "@/lib/user-service";
import {
  getDownvotedPosts,
  getUpvotedPosts,
  getUserPosts,
} from "@/lib/post-service";
import { getUserReplies } from "@/lib/reply-service";
import { isProfilePrivate } from "@/lib/settings-service";

import { Overview } from "./_components/overview";
import { UserContainer } from "./_components/user-container";

interface UserIdPageProps {
  params: {
    userId: number;
  };
}

const UserIdPage = async ({ params }: UserIdPageProps) => {
  const { getToken } = auth();

  const otherUser = await getUser(params.userId);
  if (!otherUser) {
    return notFound();
  }

  const self = await getSelf();

  const isPrivate = await isProfilePrivate(params.userId);
  if (isPrivate) {
    return (
      <UserContainer self={self} otherUser={otherUser} isPrivate={isPrivate}>
        <div className="flex items-center justify-center">
          <Frown className="mr-2 h-5 w-5" />
          <p className="font-semibold text-sm">
            This user has privated their profile, you are not allowed to see
            their posts.
          </p>
        </div>
      </UserContainer>
    );
  }

  const [token, posts, replies, upvotedPosts, downvotedPosts] =
    await Promise.all([
      getToken(),
      getUserPosts(params.userId),
      getUserReplies(params.userId),
      getUpvotedPosts(params.userId),
      getDownvotedPosts(params.userId),
    ]);

  return (
    <UserContainer self={self} otherUser={otherUser} isPrivate={isPrivate}>
      <Overview
        posts={posts}
        replies={replies}
        upvoted={upvotedPosts}
        downvoted={downvotedPosts}
        self={self}
        token={token}
      />
    </UserContainer>
  );
};

export default UserIdPage;
