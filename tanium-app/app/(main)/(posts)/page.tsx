import { auth } from "@clerk/nextjs";

import { getPosts } from "@/lib/post-service";
import { getSelf } from "@/lib/user-service";
import { Container } from "@/components/container";

import { Posts } from "./_components/posts";

const MainPage = async () => {
  const { getToken } = auth();

  const [self, posts, token] = await Promise.all([
    getSelf(),
    getPosts(),
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

export default MainPage;
