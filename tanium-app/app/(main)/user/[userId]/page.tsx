import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { getSelf, getUser } from "@/lib/user-service";
import {
  getDownvotedPosts,
  getUpvotedPosts,
  getUserPosts,
} from "@/lib/post-service";
import { getUserReplies } from "@/lib/reply-service";

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

  const [self, token, posts, replies, upvotedPosts, downvotedPosts] =
    await Promise.all([
      getSelf(),
      getToken(),
      getUserPosts(params.userId),
      getUserReplies(params.userId),
      getUpvotedPosts(params.userId),
      getDownvotedPosts(params.userId),
    ]);

  return (
    <UserContainer self={self} otherUser={otherUser}>
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
