"use client";

import { UserCard, UserCardSkeleton } from "@/components/user-card";
import { useIsClient } from "@/hooks/use-is-client";

import { NoResults } from "./no-results";

interface UsersProps {
  users: User[];
}

export const Users = ({ users }: UsersProps) => {
  const isClient = useIsClient();

  if (!isClient) {
    return <UsersSkeleton />;
  }

  return (
    <div className="space-y-4">
      {users.map((u) => (
        <UserCard key={u.id} user={u} />
      ))}
      {users.length === 0 && <NoResults />}
    </div>
  );
};

export const UsersSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(10)].map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
};
