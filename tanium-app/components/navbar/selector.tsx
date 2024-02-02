"use client";

import Image from "next/image";
import {
  ChevronDown,
  Flame,
  Home,
  PenLine,
  Pencil,
  Plus,
  Rocket,
  SearchIcon,
  Settings,
  UserPlus,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

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
import { useCommunity } from "@/hooks/use-community";
import { useUser } from "@/hooks/use-user";
import { instance } from "@/lib/axios-config";

import { DataItem } from "./data-item";

interface SelectorProps {
  self: User | null;
  token: string | null;
  communities: Community[] | null;
  allowedToCreateCommunity: boolean;
}

export const Selector = ({
  self,
  communities,
  token,
  allowedToCreateCommunity,
}: SelectorProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const pathname = usePathname();
  const router = useRouter();

  const community = useCommunity();
  const user = useUser();

  const { onOpen } = useModal((state) => state);

  const onClick = (url: string) => {
    router.push(url);
  };

  const onCommunityClick = (community: Community) => {
    router.push(`/community/${community.id}`);
  };

  const icons = [
    {
      label: "Home",
      isVisible: pathname === "/",
      Icon: Home,
    },
    {
      label: "Create Post",
      isVisible: pathname === "/submit",
      Icon: Plus,
    },
    {
      label: "Hot",
      isVisible: pathname === "/hot",
      Icon: Flame,
    },
    {
      label: "Best",
      isVisible: pathname === "/best",
      Icon: Rocket,
    },
    {
      label: "Search",
      isVisible: pathname === "/search",
      Icon: SearchIcon,
    },
    {
      label: "Update",
      isVisible: pathname.includes("/update"),
      Icon: Pencil,
    },
    {
      label: "Settings",
      isVisible: pathname === "/settings",
      Icon: Settings,
    },
  ];

  const onCreateCommunity = async () => {
    if (allowedToCreateCommunity) {
      onOpen("createCommunity", { token });
    }

    // Redirect to subscribe page
    try {
      setIsLoading(true);

      const response = await instance.get("/api/stripe", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = response.data as string;

      window.location.href = url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full" asChild>
        <Button
          variant="ghost"
          className="sm:w-32 md:w-32 xl:w-56 border border-white/10 hover:border-white/50 transition">
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="flex items-center justify-center w-full">
                {icons.map(({ label, Icon, isVisible }) => {
                  if (!isVisible) {
                    return null;
                  }

                  return (
                    <div
                      key={label}
                      className="flex items-center justify-center">
                      <Icon className="h-6 w-6 mr-2" />
                      <p className="font-semibold">{label}</p>
                    </div>
                  );
                })}

                {pathname.includes("/community") && community && (
                  <DataItem
                    label={community.name}
                    imageUrl={community.imageUrl}
                  />
                )}

                {pathname.includes("/user") && user && (
                  <DataItem label={user.username} imageUrl={user.imageUrl} />
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
          onClick={() => onClick("/")}
          disabled={isLoading}>
          <div className="flex items-center justify-center">
            <Home className="h-6 w-6 mr-2" />
            Home
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => onClick("/hot")}
          disabled={isLoading}>
          <div className="flex items-center justify-center">
            <Flame className="h-6 w-6 mr-2" />
            Hot
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => onClick("/best")}
          disabled={isLoading}>
          <div className="flex items-center justify-center">
            <Rocket className="h-6 w-6 mr-2" />
            Best
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
              onClick={() => onClick("/settings")}
              disabled={isLoading}>
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
              onClick={() => onClick("/submit")}
              disabled={isLoading}>
              <div className="flex items-center justify-center">
                <Plus className="h-6 w-6 mr-2" />
                Create Post
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              disabled={allowedToCreateCommunity === false || isLoading}
              onClick={onCreateCommunity}>
              <div className="flex items-center justify-center">
                {allowedToCreateCommunity && (
                  <UserPlus className="h-6 w-6 mr-2" />
                )}
                {!allowedToCreateCommunity && (
                  <PenLine className="h-6 w-6 mr-2" />
                )}
                {allowedToCreateCommunity ? "Create Community" : "Subscribe"}
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
