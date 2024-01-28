"use client";

import Link from "next/link";
import { BanIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Ban = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <BanIcon className="h-20 w-20 text-red-500" />
      <p className="font-semibold">
        You are currently banned from seeing this page.
      </p>
      <Button variant="link" className="mt-2" asChild>
        <Link href="/">Go to home</Link>
      </Button>
    </div>
  );
};
