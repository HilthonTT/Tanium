"use client";

import { MemberCard } from "@/components/member-card";

interface MembersProps {
  members: Member[];
  community: Community;
  token: string;
}

export const Members = ({ members, token, community }: MembersProps) => {
  return (
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
  );
};
