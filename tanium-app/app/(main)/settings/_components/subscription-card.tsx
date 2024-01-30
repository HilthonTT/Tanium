"use client";

import { Button } from "@/components/ui/button";

interface PublicizeCardProps {}

export const SubscriptionCard = ({}: PublicizeCardProps) => {
  return (
    <div className="bg-secondary rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Manage Subscription</h2>
        <Button className="bg-gradient-to-r from-zinc-500 to-slate-900 text-white">
          Manage
        </Button>
      </div>
    </div>
  );
};
