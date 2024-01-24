import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { getSelf, getUser } from "@/lib/user-service";
import { getUserPosts } from "@/lib/post-service";
import { Separator } from "@/components/ui/separator";
import { PostCard, PostCardSkeleton } from "@/components/post-card";

import { UserContainer } from "../_components/user-container";

interface UserPostsPageProps {
  params: {
    userId: number;
  };
}

const UserPostsPage = async ({ params }: UserPostsPageProps) => {
  const otherUser = await getUser(params.userId);
  if (!otherUser) {
    return notFound();
  }

  const { getToken } = auth();

  const [self, posts, token] = await Promise.all([
    getSelf(),
    getUserPosts(params.userId),
    getToken(),
  ]);

  return (
    <UserContainer self={self} otherUser={otherUser}>
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
      {posts.length === 0 && (
        <div>
          <h2 className="text-xl font-semibold uppercase">No posts...</h2>
          <Separator className="w-full my-2" />
          <div className="w-full h-full space-y-4">
            {[...Array(10)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}
    </UserContainer>
  );
};

export default UserPostsPage;
