"use client";

import { useRouter } from "next/navigation";
import { Home, ShieldPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/store/use-modal-store";
import { instance } from "@/lib/axios-config";
import { Skeleton } from "@/components/ui/skeleton";

interface AdvertisingProps {
  token: string | null;
  pro: boolean;
  allowedToCreateCommunities: boolean;
}

export const Advertising = ({
  token,
  pro,
  allowedToCreateCommunities,
}: AdvertisingProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const { onOpen } = useModal((state) => state);

  const onCreatePost = () => {
    router.push("/submit");
  };

  const onCreateCommunity = () => {
    onOpen("createCommunity", { token });
  };

  const onSubcribe = async () => {
    if (!token) {
      return router.push("/sign-in");
    }

    try {
      setIsLoading(true);

      const response = await instance.get("/api/stripe", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = response.data;

      window.location.href = url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-md p-2 bg-secondary">
        <div className="flex items-center mb-2">
          <ShieldPlus className="h-8 w-8 text-emerald-500" />
          <div className="flex flex-col ml-2">
            <p className="text-sm font-semibold">Tanium Premium</p>
            <p className="text-xs">The best Tanium experience</p>
          </div>
        </div>
        {!pro && (
          <Button
            onClick={onSubcribe}
            disabled={isLoading}
            variant="premium"
            className="rounded-full w-full">
            <span className="truncate">Try now</span>
          </Button>
        )}
        {pro && (
          <Button
            onClick={onSubcribe}
            disabled={isLoading}
            variant="premium"
            className="rounded-full w-full">
            <span className="truncate">Manage Subscription</span>
          </Button>
        )}
      </div>
      <div className="rounded-md p-2 bg-secondary">
        <div className="flex items-center">
          <Home className="text-emerald-500 h-8 w-8 mr-2" />
          <p className="font-semibold">Home</p>
        </div>
        <p className="text-sm mt-2 font-semibold">
          Your personalized Tanium page
        </p>

        <Separator className="my-4 bg-primary/30" />

        <div className="space-y-2 flex flex-col">
          <Button onClick={onCreatePost} className="rounded-full font-bold">
            Create Post
          </Button>
          <Button
            onClick={onCreateCommunity}
            disabled={allowedToCreateCommunities === false}
            variant="outline"
            className="rounded-full font-bold border-white bg-secondary hover:bg-background/10">
            <span className="truncate">
              {allowedToCreateCommunities
                ? "Create Community"
                : "You can't create communities"}
            </span>
          </Button>
        </div>
      </div>
    </>
  );
};

export const AdvertisingSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-start space-x-2">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="w-40 h-6" />
        </div>
        <Skeleton className="w-48 h-4" />
        <Skeleton className="rounded-full bg-emerald-500 w-full h-10" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-start space-x-2">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="w-40 h-6" />
        </div>
        <Separator className="my-2" />
        <Skeleton className="w-48 h-4" />
        <Skeleton className="rounded-full bg-white w-full h-10" />
        <Skeleton className="rounded-full border-white border-2 w-full h-10" />
      </div>
    </div>
  );
};
