"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface HeaderTabsProps {
  user: User;
}

export const HeaderTabs = ({ user }: HeaderTabsProps) => {
  const pathname = usePathname();

  const routes = [
    {
      href: `/user/${user.id}`,
      label: "Overview",
    },
    {
      href: `/user/${user.id}/posts`,
      label: "Posts",
    },
    {
      href: `/user/${user.id}/comments`,
      label: "Comments",
    },
    {
      href: `/user/${user.id}/upvoted`,
      label: "Upvoted",
    },
    {
      href: `/user/${user.id}/downvoted`,
      label: "Downvoted",
    },
  ];

  return (
    <div className="h-10 bg-zinc-900 border-t-[1px] border-zinc-500 flex items-center justify-center">
      <div className="space-x-4 flex items-center justify-center">
        {routes.map((route) => (
          <Link
            href={route.href}
            className={cn(
              "uppercase font-semibold text-sm text-muted-foreground",
              route.href === pathname && "underline text-primary"
            )}>
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
