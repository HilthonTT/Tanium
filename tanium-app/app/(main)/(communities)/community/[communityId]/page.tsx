import { notFound } from "next/navigation";

import { getCommunity } from "@/lib/community-service";
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

  const [isMember, members] = await Promise.all([
    isCommunityMember(community.id),
    getCommunityMembers(community.id),
  ]);

  return (
    <div className="relative h-full w-full">
      <Header community={community} isMember={isMember} members={members} />
    </div>
  );
};

export default CommunityIdPage;
