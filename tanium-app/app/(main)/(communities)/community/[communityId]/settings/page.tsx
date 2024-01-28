import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { getCommunity } from "@/lib/community-service";
import { getSelf } from "@/lib/user-service";
import { Container } from "@/components/container";
import { getCommunityMembers } from "@/lib/member-service";

import { Header } from "./_components/header";
import { EditForm } from "./_components/edit-form";
import { Footer } from "./_components/footer";

interface SettingsPageProps {
  params: {
    communityId: number;
  };
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
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

  const isOwner = community.userId === self.id;
  if (!isOwner) {
    return redirect("/");
  }

  return (
    <div className="bg-black">
      <Header
        community={community}
        isOwner={isOwner}
        token={token}
        members={members}
      />
      <Container>
        <EditForm community={community} token={token} />
        <Footer community={community} />
      </Container>
    </div>
  );
};

export default SettingsPage;
