import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { getCommunity } from "@/lib/community-service";
import { getSelf } from "@/lib/user-service";
import { getCommunityMembers, isCommunityMember } from "@/lib/member-service";

import { Header } from "./_components/header";

interface CommunityIdPageProps {
  params: {
    communityId: number;
  };
}

const CommunityIdPage = async ({ params }: CommunityIdPageProps) => {
  const community = await getCommunity(params.communityId);

  if (!community) {
    return notFound();
  }

  const { getToken } = auth();

  const [self, isMember, members, token] = await Promise.all([
    getSelf(),
    isCommunityMember(community.id),
    getCommunityMembers(community.id),
    getToken(),
  ]);

  return (
    <div className="relative h-full w-full">
      <Header
        self={self}
        community={community}
        isMember={isMember}
        members={members}
        token={token}
      />
    </div>
  );
};

export default CommunityIdPage;
