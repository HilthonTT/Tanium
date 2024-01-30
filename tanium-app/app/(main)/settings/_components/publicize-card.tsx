"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { instance } from "@/lib/axios-config";

interface PublicizeCardProps {
  settings: UserSettings;
  token: string;
}

export const PublicizeCard = ({ settings, token }: PublicizeCardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onChange = async () => {
    try {
      setIsLoading(true);

      settings.isProfilePublic = !settings.isProfilePublic;

      await instance.patch("/api/usersettings", settings, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const label = settings.isProfilePublic
        ? "Your profile is now public"
        : "Your profile is now private";

      toast.success(label);

      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-secondary rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Publicize Profile</h2>
        <div>
          <Switch
            onCheckedChange={onChange}
            disabled={isLoading}
            checked={settings.isProfilePublic}>
            {settings.isProfilePublic ? "Public" : "Private"}
          </Switch>
        </div>
      </div>
    </div>
  );
};
