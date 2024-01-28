"use client";

import { formatDate } from "date-fns";
import { Calendar } from "lucide-react";

import { Separator } from "@/components/ui/separator";

interface FooterProps {
  community: Community;
}

const DATE_FORMAT = "MMMM dd, yyyy";

export const Footer = ({ community }: FooterProps) => {
  return (
    <div className="mt-4 px-4 lg:px-0">
      <h2 className="font-bold text-xl">Information</h2>
      <Separator className="my-4" />
      <div className="rounded-md bg-secondary p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center">
            <Calendar className="h-5 w-5 mr-2" />
            <p className="font-semibold">
              Created {formatDate(community.dateCreated, DATE_FORMAT)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
