"use client";

import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface UserCardProps {
  user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`/user/${user.id}`);
  };

  return (
    <div className="rounded-md bg-secondary p-4">
      <div className="flex items-center justify-start">
        <UserAvatar
          username={user.username}
          imageUrl={user.imageUrl}
          size="md"
        />
        <div className="pl-2 flex flex-col items-start justify-start">
          <p className="font-semibold capitalize">{user.username}</p>
          <p className="text-muted-foreground text-xs">
            Joined{" "}
            {formatDistanceToNow(user.dateCreated, {
              addSuffix: true,
            })}
          </p>
        </div>
        <div className="ml-auto">
          <Button onClick={onClick} className="rounded-full font-semibold">
            View
          </Button>
        </div>
      </div>
    </div>
  );
};

export const UserCardSkeleton = () => {
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
