import { auth } from "@clerk/nextjs";

import { getSelf } from "@/lib/user-service";
import { getBestPosts } from "@/lib/post-service";

import { Posts } from "../_components/posts";

const BestPage = async () => {
  const { getToken } = auth();

  const [self, posts, token] = await Promise.all([
    getSelf(),
    getBestPosts(),
    getToken(),
  ]);

  return (
    <div className="h-full mx-auto max-w-5xl space-y-4">
      <Posts posts={posts} self={self} token={token} />
    </div>
  );
};

export default BestPage;
