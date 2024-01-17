"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const avatarSizes = cva("", {
  variants: {
    size: {
      default: "h-8 w-8",
      sm: "h-6 w-6",
      md: "h-10 w-10",
      lg: "h-14 w-14",
      xl: "h-24 w-24",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  username: string;
  imageUrl: string;
  className?: string;
}

export const UserAvatar = ({
  username,
  imageUrl,
  size,
  className,
}: UserAvatarProps) => {
  return (
    <div className={cn("relative", className)}>
      <Avatar className={cn(avatarSizes({ size }))}>
        <AvatarImage src={imageUrl} />
        <AvatarFallback>
          {username[0]}
          {username[username.length - 1]}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

interface UserAvatarSkeletonProps extends VariantProps<typeof avatarSizes> {}

export const UserAvatarSkeleton = ({ size }: UserAvatarSkeletonProps) => {
  return <Skeleton className={cn("rounded-full", avatarSizes({ size }))} />;
};
