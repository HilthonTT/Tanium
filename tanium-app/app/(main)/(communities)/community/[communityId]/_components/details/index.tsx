"use client";

import { Container } from "@/components/container";
import { useIsClient } from "@/hooks/use-is-client";

import { Header, HeaderSkeleton } from "./header";
import { Posts, PostsSkeleton } from "./posts";

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
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <div className="relative w-full bg-black">
        <HeaderSkeleton />
        <Container className="pt-4">
          <PostsSkeleton />
        </Container>
      </div>
    );
  }

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
        <Posts
          posts={posts}
          self={self}
          token={token}
          community={community}
          isMember={isMember}
        />
      </Container>
    </div>
  );
};
