"use client";

import { Badge, Flame, Rocket } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export const FilterTab = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="rounded-md bg-secondary p-2">
      <div className="flex items-center justify-start space-x-2">
        <Button
          onClick={() => router.push("/")}
          variant="ghost"
          className="group">
          <Badge
            className={cn(
              "h-6 w-6 mr-2 text-muted-foreground group-hover:text-white transition",
              pathname === "/" && "text-white"
            )}
          />
          <p
            className={cn(
              "text-muted-foreground group-hover:text-white transition",
              pathname === "/" && "text-white"
            )}>
            New
          </p>
        </Button>
        <Button
          onClick={() => router.push("/hot")}
          variant="ghost"
          className="group">
          <Flame
            className={cn(
              "h-6 w-6 mr-2 text-muted-foreground group-hover:text-white transition",
              pathname === "/hot" && "text-white"
            )}
          />
          <p
            className={cn(
              "text-muted-foreground group-hover:text-white transition",
              pathname === "/hot" && "text-white"
            )}>
            Hot
          </p>
        </Button>
        <Button
          onClick={() => router.push("/best")}
          variant="ghost"
          className="group">
          <Rocket
            className={cn(
              "h-6 w-6 mr-2 text-muted-foreground group-hover:text-white transition",
              pathname === "/best" && "text-white"
            )}
          />
          <p
            className={cn(
              "text-muted-foreground group-hover:text-white transition",
              pathname === "/best" && "text-white"
            )}>
            Best
          </p>
        </Button>
      </div>
    </div>
  );
};

export const FilterTabSkeleton = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-center space-x-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>

      <Skeleton className="h-10 w-20 ml-auto" />
    </div>
  );
};
