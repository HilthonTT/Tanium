"use client";

import qs from "query-string";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const DATE_FORMAT = "MMMM dd, yyyy";

interface CommunityDetailsProps {
  community: Community;
  isMember: boolean;
}

export const CommunityDetails = ({
  community,
  isMember,
}: CommunityDetailsProps) => {
  const router = useRouter();

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
    <div className="rounded-md p-2 bg-secondary">
      <h2 className="text-muted-foreground text-sm font-semibold">
        About Community
      </h2>
      <div className="pt-2 space-y-5">
        <p className="text-sm break-words">{community.description}</p>
        <div className="flex items-center justify-start">
          <Calendar className="h-6 w-6 mr-2" />
          <p className="text-muted-foreground text-sm">
            Created {format(community.dateCreated, DATE_FORMAT)}
          </p>
        </div>
        {isMember && (
          <>
            {" "}
            <Separator className="my-4 bg-primary/30" />
            <Button
              onClick={onCreatePost}
              className="rounded-full  font-semibold w-full">
              Create Post
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export const CommunityDetailsSkeleton = () => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-start space-x-2">
        <Skeleton className="w-6 h-6" />
        <Skeleton className="w-40 h-6" />
      </div>
      <div className="flex items-center justify-start space-x-2">
        <Skeleton className="w-6 h-6" />
        <Skeleton className="w-40 h-6" />
      </div>
      <Skeleton className="w-48 h-4" />
      <Skeleton className="rounded-full bg-white w-full h-10" />
    </div>
  );
};
