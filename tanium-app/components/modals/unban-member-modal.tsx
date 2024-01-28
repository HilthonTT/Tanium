"use client";

import { ElementRef, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useModal } from "@/store/use-modal-store";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { instance } from "@/lib/axios-config";

export const UnBanMemberModal = () => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { isOpen, type, data, onClose } = useModal((state) => state);
  const { token, ban } = data;

  const isModalOpen = isOpen && type === "unbanMember";

  const onUnban = async () => {
    try {
      setIsLoading(true);

      await instance.delete(`/api/ban/${ban?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      router.refresh();

      toast.success("Unbanned user!");
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="text-start">
          <DialogTitle className="truncate">
            Unban &apos;{ban?.bannedUser?.username}&apos;?
          </DialogTitle>
          <DialogDescription>
            This user will be allowed to view the community contents and join
            the community.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose ref={closeRef} asChild>
            <Button
              variant="outline"
              disabled={isLoading}
              className="rounded-full font-bold">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onUnban}
            disabled={isLoading}
            className="rounded-full font-bold">
            Unban
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
