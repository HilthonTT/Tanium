import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";

import { getSelf } from "@/lib/user-service";
import { getCommunity } from "@/lib/community-service";
import { getCommunityBans, searchCommunityBans } from "@/lib/ban-service";
import { getCommunityMembers } from "@/lib/member-service";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SearchUsername } from "@/components/search-username";
import { BanCard } from "@/components/ban-card";

import { Header } from "../_components/header";

interface SettingsBansPageProps {
  params: {
    communityId: number;
  };
  searchParams: {
    username: string;
  };
}

const getBans = async (query: string, token: string, communityId: number) => {
  if (!!query) {
    return await searchCommunityBans(token, communityId, query);
  }

  return await getCommunityBans(token, communityId);
};

const SettingsBansPage = async ({
  searchParams,
  params,
}: SettingsBansPageProps) => {
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

  const [members, bans] = await Promise.all([
    getCommunityMembers(community.id),
    getBans(searchParams.username, token, community.id),
  ]);

  return (
    <>
      <Header
        community={community}
        isOwner={isOwner}
        token={token}
        members={members}
      />
      <Container>
        <div className="flex items-center justify-between pt-10">
          <h1 className="text-2xl font-semibold">
            Banned Users ({bans.length})
          </h1>
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
          {bans.map((ban) => (
            <BanCard key={ban.id} ban={ban} token={token} />
          ))}
        </div>
      </Container>
    </>
  );
};

export default SettingsBansPage;
