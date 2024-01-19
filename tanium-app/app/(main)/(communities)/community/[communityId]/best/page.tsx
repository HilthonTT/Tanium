import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { getCommunity } from "@/lib/community-service";
import { getSelf } from "@/lib/user-service";
import { getCommunityMembers, isCommunityMember } from "@/lib/member-service";
import { getBestCommunityPosts } from "@/lib/post-service";

import { CommunityDetails } from "../_components/details";

interface CommunityBestPageProps {
  params: {
    communityId: number;
  };
}

const CommunityBestPage = async ({ params }: CommunityBestPageProps) => {
  const community = await getCommunity(params.communityId);

  if (!community) {
    return notFound();
  }

  const { getToken } = auth();

  const [self, isMember, members, token, posts] = await Promise.all([
    getSelf(),
    isCommunityMember(community.id),
    getCommunityMembers(community.id),
    getToken(),
    getBestCommunityPosts(community.id),
  ]);

  return (
    <CommunityDetails
      self={self}
      isMember={isMember}
      members={members}
      token={token}
      posts={posts}
      community={community}
    />
  );
};

export default CommunityBestPage;
