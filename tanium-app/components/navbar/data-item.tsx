"use client";

import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DataItemProps {
  label: string;
  imageUrl?: string | null;
}

export const DataItem = ({ label, imageUrl }: DataItemProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative h-8 w-8">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Image"
            className="object-cover rounded-full"
            fill
          />
        )}
        {!imageUrl && (
          <Avatar className="bg-secondary">
            <AvatarFallback>
              <p className="capitalize">
                {label[0]} {label[label.length - 1]}
              </p>
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <div className="ml-2 flex items-center justify-center max-w-[50px] xl:max-w-[100px]">
        <p className="font-semibold truncate text-xs text-ellipsis capitalize">
          {label}
        </p>
      </div>
    </div>
  );
};
