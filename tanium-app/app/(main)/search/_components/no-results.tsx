"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export const NoResults = () => {
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  return (
    <div className="relative rounded-md bg-secondary flex items-center space-x-4">
      <div className="relative h-32 w-32 bg-white rounded-lg">
        <Image src="/logo.svg" alt="Logo" fill />
      </div>
      <div className="block space-y-2 max-w-[80%]">
        <h2 className="font-semibold text-xl truncate">
          Hmm... we couldn&apos;t find any result with "{query}"
        </h2>
        <p className="text-muted-foreground text-sm">
          Double-check your spelling or try different keywords to adjust your
          search
        </p>
      </div>
      <div className="absolute top-0 right-0">
        <Button
          variant="ghost"
          className="hover:opacity-75 transition"
          aria-label="Back To Home Page"
          asChild>
          <Link href="/">
            <X className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
