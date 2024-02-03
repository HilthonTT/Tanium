"use client";

import {
  CommunityCard,
  CommunityCardSkeleton,
} from "@/components/community-card";

import { NoResults } from "./no-results";
import { useIsClient } from "@/hooks/use-is-client";

interface CommunitiesProps {
  communities: Community[];
}

export const Communities = ({ communities }: CommunitiesProps) => {
  const isClient = useIsClient();
  if (!isClient) {
    return <CommunitiesSkeleton />;
  }

  return (
    <div className="space-y-4">
      {communities.map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}
      {communities.length === 0 && <NoResults />}
    </div>
  );
};

export const CommunitiesSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(10)].map((_, i) => (
        <CommunityCardSkeleton key={i} />
      ))}
    </div>
  );
};
