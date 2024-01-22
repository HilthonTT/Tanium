"use client";

import { Container } from "@/components/container";

import { Header } from "./header";
import { Posts } from "./posts";

interface CommunityDetailsProps {
  self: User | null;
  community: Community;
  isMember: boolean;
  members: Member[];
  token: string | null;
  posts: Post[];
}

export const CommunityDetails = ({
  self,
  community,
  isMember,
  members,
  token,
  posts,
}: CommunityDetailsProps) => {
  return (
    <div className="relative w-full bg-black">
      <Header
        self={self}
        community={community}
        isMember={isMember}
        members={members}
        token={token}
      />
      <Container className="pt-4">
        <Posts posts={posts} self={self} token={token} community={community} />
      </Container>
    </div>
  );
};
