"use client";

import { CommunityCard } from "@/components/community-card";

import { NoResults } from "./no-results";

interface CommunitiesProps {
  communities: Community[];
}

export const Communities = ({ communities }: CommunitiesProps) => {
  return (
    <div className="space-y-4">
      {communities.map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}
      {communities.length === 0 && <NoResults />}
    </div>
  );
};
