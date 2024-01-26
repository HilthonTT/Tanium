import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";

import { getCommunity } from "@/lib/community-service";
import { getCommunityMembers } from "@/lib/member-service";
import { Container } from "@/components/container";
import { getSelf } from "@/lib/user-service";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Header } from "../_components/header";
import { Members } from "./_components/members";

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
      <Container>
        <div className="flex items-center justify-between pt-10">
          <h1 className="text-2xl font-semibold">Members ({members.length})</h1>
          <Button variant="outline" asChild>
            <Link href={`/community/${community.id}/settings`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>
        <Separator className="my-4" />
        <Members members={members} community={community} token={token} />
      </Container>
    </>
  );
};

export default SettingsMemberPage;
