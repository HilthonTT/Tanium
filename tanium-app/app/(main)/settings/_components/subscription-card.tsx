"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { instance } from "@/lib/axios-config";

interface PublicizeCardProps {
  token: string;
  pro: boolean;
}

export const SubscriptionCard = ({ token, pro }: PublicizeCardProps) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);

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
      setLoading(false);
    }
  };

  const label = pro ? "Manage" : "Subscribe";

  return (
    <div className="bg-secondary rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Manage Subscription</h2>
        <Button
          onClick={onClick}
          disabled={loading}
          className="bg-gradient-to-r from-zinc-500 to-slate-900 text-white">
          {label}
        </Button>
      </div>
    </div>
  );
};
