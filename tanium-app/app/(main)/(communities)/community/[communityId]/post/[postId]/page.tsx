import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { Container } from "@/components/container";
import { getCommunity } from "@/lib/community-service";
import { getPost } from "@/lib/post-service";
import { getSelf } from "@/lib/user-service";
import { getPostReplies } from "@/lib/reply-service";
import { isCommunityBanned } from "@/lib/ban-service";
import { Ban } from "@/components/ban";

import { Header } from "./_components/header";
import { Details } from "./_components/details";

interface CommunityPostIdPageProps {
  params: {
    communityId: number;
    postId: number;
  };
}

const CommunityPostIdPage = async ({ params }: CommunityPostIdPageProps) => {
  const { getToken } = auth();

  const community = await getCommunity(params.communityId);
  if (!community) {
    return notFound();
  }

  const isBanned = await isCommunityBanned(community.id);
  if (isBanned) {
    return <Ban />;
  }

  const [post, token, self] = await Promise.all([
    getPost(params.postId),
    getToken(),
    getSelf(),
  ]);

  if (!post) {
    return notFound();
  }

  const replies = await getPostReplies(post.id);

  const calculatedUpvotes = post.upvotes.length - post.downvotes.length;

  return (
    <div className="bg-black">
      <Container>
        <Header
          post={post}
          calculatedUpvotes={calculatedUpvotes}
          token={token}
          self={self}
        />
        <div className="pt-20 pb-10">
          <Details
            post={post}
            community={community}
            replies={replies}
            self={self}
            token={token}
          />
        </div>
      </Container>
    </div>
  );
};

export default CommunityPostIdPage;
