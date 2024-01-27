"use client";

import { ElementRef, useRef, useTransition } from "react";
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

export const KickMemberModal = () => {
  const [isLoading, startTransition] = useTransition();
  const closeRef = useRef<ElementRef<"button">>(null);

  const router = useRouter();
  const { isOpen, type, data, onClose } = useModal((state) => state);
  const { member, token } = data;

  const isModalOpen = isOpen && type === "kickMember";

  const onClick = async () => {
    try {
      await instance.delete(`api/member/${member?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onClose();
      router.refresh();
      toast.success("User kicked!");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onKick = () => {
    startTransition(async () => {
      await onClick();
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="text-start">
          <DialogTitle className="truncate capitalize">
            Kick &apos;{member?.user.username}&apos;?
          </DialogTitle>
          <DialogDescription>
            Kicking this user means that they aren&apos;t part of the community
            anymore.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose ref={closeRef} asChild>
            <Button
              variant="outline"
              className="rounded-full font-bold"
              disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onKick}
            className="rounded-full font-bold"
            disabled={isLoading}>
            Kick
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
