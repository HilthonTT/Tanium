"use client";

import Link from "next/link";
import { format } from "date-fns";

import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface CommunityCardProps {
  community: Community;
}

export const CommunityCard = ({ community }: CommunityCardProps) => {
  return (
    <div className="relative rounded-md bg-secondary flex items-start justify-start p-2 w-full border-[0.1px] hover:border-zinc-500 transition">
      <UserAvatar
        username={community.name}
        imageUrl={community.imageUrl || ""}
        size="lg"
      />
      <div className="pl-5 space-y-2 max-w-[80%] w-full">
        <div className="flex items-center gap-x-2">
          <p className="font-semibold text-sm">{community.name}</p>
          <p className="text-xs text-muted-foreground">
            Since {format(community.dateCreated, "MMMM dd yyyy")}
          </p>
        </div>
        <p className="text-muted-foreground text-xs truncate">
          {community.description}
        </p>
      </div>
      <div className="ml-auto my-auto">
        <Button
          className="rounded-full bg-primary/10 text-primary hover:bg-primary/30"
          asChild>
          <Link href={`/community/${community.id}`}>Check out</Link>
        </Button>
      </div>
    </div>
  );
};

export const CommunityCardSkeleton = () => {
  return (
    <div className="flex items-start justify-start gap-x-2">
      <UserAvatarSkeleton size="lg" />
      <div className="space-y-2 w-full">
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-full h-5" />
      </div>
    </div>
  );
};
