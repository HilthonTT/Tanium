import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { Container } from "@/components/container";
import { getCommunity } from "@/lib/community-service";
import { getPost } from "@/lib/post-service";
import { getSelf } from "@/lib/user-service";

import { Header } from "./_components/header";
import { Details } from "./_components/details";
import { getPostReplies } from "@/lib/reply-service";

interface CommunityPostIdPageProps {
  params: {
    communityId: number;
    postId: number;
  };
}

const CommunityPostIdPage = async ({ params }: CommunityPostIdPageProps) => {
  const { getToken } = auth();

  const [community, post, token, self] = await Promise.all([
    getCommunity(params.communityId),
    getPost(params.postId),
    getToken(),
    getSelf(),
  ]);

  if (!community || !post) {
    return notFound();
  }

  const replies = await getPostReplies(post.id);

  const calculatedUpvotes = post.upvotes.length - post.downvotes.length;

  return (
    <Container>
      <Header
        post={post}
        calculatedUpvotes={calculatedUpvotes}
        token={token}
        self={self}
      />
      <div className="pt-20">
        <Details
          post={post}
          community={community}
          replies={replies}
          self={self}
          token={token}
        />
      </div>
    </Container>
  );
};

export default CommunityPostIdPage;
