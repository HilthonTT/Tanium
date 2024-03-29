import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";

import { getCommunity } from "@/lib/community-service";
import {
  getCommunityMembers,
  searchCommunityMembers,
} from "@/lib/member-service";
import { Container } from "@/components/container";
import { getSelf } from "@/lib/user-service";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MemberCard } from "@/components/member-card";
import { SearchUsername } from "@/components/search-username";

import { Header } from "../_components/header";

interface SettingsMemberPageProps {
  params: {
    communityId: number;
  };
  searchParams: {
    username: string;
  };
}

const getMembers = async (communityId: number, query?: string) => {
  if (!!query) {
    return await searchCommunityMembers(communityId, query);
  }

  return await getCommunityMembers(communityId);
};

const SettingsMemberPage = async ({
  params,
  searchParams,
}: SettingsMemberPageProps) => {
  const { getToken } = auth();

  const self = await getSelf();
  if (!self) {
    return redirect("/sign-in");
  }

  const [token, community] = await Promise.all([
    getToken(),
    getCommunity(params.communityId),
  ]);

  if (!token) {
    return redirect("/sign-in");
  }

  if (!community) {
    return redirect("/");
  }

  const isOwner = self.id === community.userId;
  if (!isOwner) {
    return redirect(`/community/${community.id}`);
  }

  const members = await getCommunityMembers(community.id);

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
        <SearchUsername />

        <div className="space-y-4">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              community={community}
              token={token}
            />
          ))}
        </div>
      </Container>
    </>
  );
};

export default SettingsMemberPage;
