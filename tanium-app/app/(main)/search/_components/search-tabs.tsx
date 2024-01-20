"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QueryType = "posts" | "comments" | "communities" | "people";

export const SearchTabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") as QueryType;

  const onClick = (type: QueryType) => {
    const url = qs.stringifyUrl({
      url: "/search",
      query: {
        type,
      },
    });

    router.push(url);
  };

  return (
    <div className="flex items-center justify-start space-x-4">
      <Button
        onClick={() => onClick("posts")}
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-secondary transition font-semibold",
          type === "posts" && "bg-secondary hover:bg-primary/20"
        )}>
        Posts
      </Button>
      <Button
        onClick={() => onClick("comments")}
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-secondary transition font-semibold",
          type === "comments" && "bg-secondary hover:bg-primary/20"
        )}>
        Comments
      </Button>
      <Button
        onClick={() => onClick("communities")}
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-secondary transition font-semibold",
          type === "communities" && "bg-secondary hover:bg-primary/20"
        )}>
        {" "}
        Communities
      </Button>

      <Button
        onClick={() => onClick("people")}
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-secondary transition font-semibold",
          type === "people" && "bg-secondary hover:bg-primary/20"
        )}>
        People
      </Button>
    </div>
  );
};
