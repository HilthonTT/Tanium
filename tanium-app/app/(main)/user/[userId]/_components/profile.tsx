"use client";

import { formatDate } from "date-fns";
import { Cake, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { stringToColor } from "@/lib/utils";

const DATE_FORMAT = "MMMM dd, yyyy";

interface ProfileProps {
  user: User;
  self: User | null;
}

export const Profile = ({ user, self }: ProfileProps) => {
  const router = useRouter();

  const bannerColor = stringToColor(`${user.username}-${user.id}`);

  const onSettingsClick = () => {
    router.push("/settings");
  };

  const onCreatePost = () => {
    router.push("/submit");
  };

  const isOwner = user.id === self?.id;

  return (
    <div className="relative rounded-md h-full w-full bg-secondary">
      <div
        className="h-20 w-full rounded-md rounded-b-none"
        style={{ backgroundColor: bannerColor }}
      />
      <div className="absolute top-8 left-3">
        <UserAvatar
          username={user.username}
          imageUrl={user.imageUrl}
          size="lg"
        />
      </div>
      <div className="pl-2 py-4">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-xl capitalize">{user.username}</h1>
          {isOwner && (
            <Button
              onClick={onSettingsClick}
              variant="ghost"
              aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="w-full">
          <div className="flex items-center justify-start gap-x-1">
            <Cake className="h-4 w-4" />
            <p className="font-semibold text-sm text-zinc-300">Cake Day</p>
          </div>
          <p className="text-muted-foreground text-sm">
            {formatDate(user.dateCreated, DATE_FORMAT)}
          </p>
        </div>
      </div>
      {isOwner && (
        <div className="mx-2 pb-2">
          <Button
            onClick={onCreatePost}
            className="w-full rounded-full font-bold">
            Create Post
          </Button>
        </div>
      )}
    </div>
  );
};
