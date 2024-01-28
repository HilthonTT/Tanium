import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { getCommunity } from "@/lib/community-service";
import { getSelf } from "@/lib/user-service";
import { getCommunityMembers, isCommunityMember } from "@/lib/member-service";
import { getBestCommunityPosts } from "@/lib/post-service";
import { isCommunityBanned } from "@/lib/ban-service";
import { Ban } from "@/components/ban";

import { CommunityDetails } from "../_components/details";

interface CommunityHotPageProps {
  params: {
    communityId: number;
  };
}

const CommunityHotPage = async ({ params }: CommunityHotPageProps) => {
  const community = await getCommunity(params.communityId);

  if (!community) {
    return notFound();
  }

  const isBanned = await isCommunityBanned(community.id);
  if (isBanned) {
    return <Ban />;
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

export default CommunityHotPage;
