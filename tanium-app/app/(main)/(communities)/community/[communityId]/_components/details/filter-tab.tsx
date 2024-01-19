"use client";

import { Badge, Flame, Rocket } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterTabProps {
  communityId: number;
}

export const FilterTab = ({ communityId }: FilterTabProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const onClick = (path: string) => {
    router.push(`/community/${communityId}${path}`);
  };

  return (
    <div className="rounded-md bg-secondary p-2">
      <div className="flex items-center justify-start space-x-2">
        <Button onClick={() => onClick("/")} variant="ghost" className="group">
          <Badge
            className={cn(
              "h-6 w-6 mr-2 text-muted-foreground group-hover:text-white transition",
              pathname === `/community/${communityId}` && "text-white"
            )}
          />
          <p
            className={cn(
              "text-muted-foreground group-hover:text-white transition",
              pathname === `/community/${communityId}` && "text-white"
            )}>
            New
          </p>
        </Button>
        <Button
          onClick={() => onClick("/hot")}
          variant="ghost"
          className="group">
          <Flame
            className={cn(
              "h-6 w-6 mr-2 text-muted-foreground group-hover:text-white transition",
              pathname === `/community/${communityId}/hot` && "text-white"
            )}
          />
          <p
            className={cn(
              "text-muted-foreground group-hover:text-white transition",
              pathname === `/community/${communityId}/hot` && "text-white"
            )}>
            Hot
          </p>
        </Button>
        <Button
          onClick={() => onClick("/best")}
          variant="ghost"
          className="group">
          <Rocket
            className={cn(
              "h-6 w-6 mr-2 text-muted-foreground group-hover:text-white transition",
              pathname === `/community/${communityId}/best` && "text-white"
            )}
          />
          <p
            className={cn(
              "text-muted-foreground group-hover:text-white transition",
              pathname === `/community/${communityId}/best` && "text-white"
            )}>
            Best
          </p>
        </Button>
      </div>
    </div>
  );
};
