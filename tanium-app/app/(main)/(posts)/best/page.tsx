import { auth } from "@clerk/nextjs";

import { getSelf } from "@/lib/user-service";
import { getBestPosts } from "@/lib/post-service";
import { Container } from "@/components/container";

import { Posts } from "../_components/posts";

const BestPage = async () => {
  const { getToken } = auth();

  const [self, posts, token] = await Promise.all([
    getSelf(),
    getBestPosts(),
    getToken(),
  ]);

  return (
    <div className="bg-black">
      <Container>
        <Posts posts={posts} self={self} token={token} />
      </Container>
    </div>
  );
};

export default BestPage;
