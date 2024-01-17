import { auth } from "@clerk/nextjs";

import { getHotPosts } from "@/lib/post-service";
import { getSelf } from "@/lib/user-service";

import { Posts } from "../_components/posts";

const HotPage = async () => {
  const { getToken } = auth();

  const [self, posts, token] = await Promise.all([
    getSelf(),
    getHotPosts(),
    getToken(),
  ]);

  return (
    <div className="h-full mx-auto max-w-5xl space-y-4">
      <Posts posts={posts} self={self} token={token} />
    </div>
  );
};

export default HotPage;
