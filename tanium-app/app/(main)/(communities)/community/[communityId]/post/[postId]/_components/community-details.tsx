"use client";

import Image from "next/image";
import Link from "next/link";
import qs from "query-string";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn, stringToColor } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface CommunityDetailsProps {
  community: Community;
  className?: string;
}

export const CommunityDetails = ({
  community,
  className,
}: CommunityDetailsProps) => {
  const router = useRouter();
  const bannerColor = stringToColor(community.name + community.id);

  const onCreatePost = () => {
    const url = qs.stringifyUrl({
      url: "/submit",
      query: {
        communityId: community.id,
      },
    });

    router.push(url);
  };

  return (
    <div
      className={cn(
        "rounded-md bg-secondary w-full lg:w-96 lg:order-last",
        className
      )}>
      {!community.bannerUrl && (
        <div
          className="w-full rounded-md rounded-b-none h-16"
          style={{ backgroundColor: bannerColor }}
        />
      )}
      {community.bannerUrl && (
        <div className="relative w-full h-16">
          <Image
            src={community.bannerUrl}
            alt="Banner Image"
            className="object-cover rounded-md rounded-b-none"
            fill
          />
        </div>
      )}

      <div className="pt-3 p-2">
        <div className="flex items-center justify-start gap-x-2">
          <UserAvatar
            username={community.name}
            imageUrl={community.imageUrl || ""}
          />
          <Link
            href={`/community/${community.id}`}
            className="font-semibold truncate hover:underline">
            {community.name}
          </Link>
        </div>
        <div className="w-full pt-2">
          <div className="max-w-[80%]">
            <p className="break-words text-sm">{community.description}</p>
          </div>
          <div className="flex items-center justify-start pt-4">
            <Calendar className="h-6 w-6 mr-2" />
            <p className="text-muted-foreground text-sm">
              Created {format(community.dateCreated, "MMMM dd, yyyy")}
            </p>
          </div>
          <Separator className="my-4 bg-primary/30" />
          <Button
            onClick={onCreatePost}
            className="rounded-full font-semibold w-full">
            Create Post
          </Button>
        </div>
      </div>
    </div>
  );
};
