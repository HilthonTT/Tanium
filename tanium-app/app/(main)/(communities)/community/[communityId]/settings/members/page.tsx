import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { getCommunity } from "@/lib/community-service";
import { getCommunityMembers } from "@/lib/member-service";
import { Container } from "@/components/container";
import { getSelf } from "@/lib/user-service";

import { Header } from "../_components/header";

interface SettingsMemberPageProps {
  params: {
    communityId: number;
  };
}

const SettingsMemberPage = async ({ params }: SettingsMemberPageProps) => {
  const { getToken } = auth();

  const [self, token, community, members] = await Promise.all([
    getSelf(),
    getToken(),
    getCommunity(params.communityId),
    getCommunityMembers(params.communityId),
  ]);

  if (!self || !token) {
    return redirect("/sign-in");
  }

  if (!community) {
    return redirect("/");
  }

  const isOwner = self.id === community.userId;
  if (!isOwner) {
    return redirect(`/community/${community.id}`);
  }

  return (
    <>
      <Header
        community={community}
        isOwner={isOwner}
        members={members}
        token={token}
      />
      <Container>Members</Container>
    </>
  );
};

export default SettingsMemberPage;
