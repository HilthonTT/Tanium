"use client";

import Image from "next/image";
import {
  ArrowUpRightFromCircle,
  ChevronDown,
  Home,
  LineChart,
  Plus,
  UserPlus,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useModal } from "@/store/use-modal-store";

interface SelectorProps {
  self: User | null;
  token: string | null;
  communities: Community[] | null;
}

export const Selector = ({ self, communities, token }: SelectorProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { onOpen } = useModal((state) => state);

  const onClick = (url: string) => {
    router.push(url);
  };

  const onCommunityClick = (community: Community) => {
    router.push(`/community/${community.id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-56 border border-white/10  hover:border-white/50 transition">
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="flex items-center justify-center">
                {pathname === "/" && (
                  <>
                    <Home className="h-6 w-6 mr-2" />
                    Home
                  </>
                )}
                {pathname === "/submit" && (
                  <>
                    <Plus className="h-6 w-6 mr-2" />
                    Create Post
                  </>
                )}
              </div>
            </div>
            <ChevronDown />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" className="w-56 space-y-2">
        {communities?.length !== 0 && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Your communities
            </DropdownMenuLabel>
            {communities?.map((community) => (
              <DropdownMenuItem
                key={community.id}
                onClick={() => onCommunityClick(community)}
                className="cursor-pointer flex items-center">
                <div className="flex items-center justify-center">
                  <div className="relative h-8 w-8">
                    {community.imageUrl && (
                      <Image
                        src={community.imageUrl}
                        alt="Community"
                        className="object-cover rounded-full"
                        fill
                      />
                    )}
                    {!community.imageUrl && (
                      <Avatar className="bg-secondary">
                        <AvatarFallback>
                          <p className="capitalize">
                            {community.name[0]}{" "}
                            {community.name[community.name.length - 1]}
                          </p>
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="ml-2 flex items-center justify-center">
                    <p className="font-semibold truncate">{community.name}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}

        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Feeds
        </DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => onClick("/")}>
          <div className="flex items-center justify-center">
            <Home className="h-6 w-6 mr-2" />
            Home
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => onClick("/popular")}>
          <div className="flex items-center justify-center">
            <ArrowUpRightFromCircle className="h-6 w-6 mr-2" />
            Popular
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => onClick("/all")}>
          <div className="flex items-center justify-center">
            <LineChart className="h-6 w-6 mr-2" />
            All
          </div>
        </DropdownMenuItem>

        {self && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Others
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onClick("/settings")}>
              <div className="flex items-center justify-center">
                <UserAvatar
                  username={self?.username}
                  imageUrl={self?.imageUrl}
                  size="sm"
                  className="mr-2"
                />
                User Settings
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onClick("/submit")}>
              <div className="flex items-center justify-center">
                <Plus className="h-6 w-6 mr-2" />
                Create Post
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onOpen("createCommunity", { token })}>
              <div className="flex items-center justify-center">
                <UserPlus className="h-6 w-6 mr-2" />
                Create Community
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
