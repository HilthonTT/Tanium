import { redirect } from "next/navigation";

import { getCommunity } from "@/lib/community-service";
import { getSelf } from "@/lib/user-service";
import { Container } from "@/components/container";

interface SettingsPageProps {
  params: {
    communityId: number;
  };
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const [self, community] = await Promise.all([
    getSelf(),
    getCommunity(params.communityId),
  ]);

  if (!self) {
    return redirect("/sign-in");
  }

  if (!community) {
    return redirect("/");
  }

  const isOwner = community.userId === self.id;
  if (!isOwner) {
    return redirect("/");
  }

  return <Container>Settings Page</Container>;
};

export default SettingsPage;
