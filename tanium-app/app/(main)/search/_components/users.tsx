"use client";

import { UserCard } from "@/components/user-card";
import { NoResults } from "./no-results";

interface UsersProps {
  users: User[];
}

export const Users = ({ users }: UsersProps) => {
  return (
    <div className="space-y-4">
      {users.map((u) => (
        <UserCard key={u.id} user={u} />
      ))}
      {users.length === 0 && <NoResults />}
    </div>
  );
};
