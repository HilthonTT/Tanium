"use client";

import { ElementRef, useRef } from "react";
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

export const DeletePostModal = () => {
  const closeRef = useRef<ElementRef<"button">>(null);

  const router = useRouter();
  const { isOpen, type, data, onClose } = useModal((state) => state);
  const { post, token } = data;

  const isModalOpen = isOpen && type === "deletePost";

  const onDelete = async () => {
    try {
      await instance.delete(`/api/post/${post?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      router.refresh();
      toast.success("Post deleted!");

      closeRef?.current?.click();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="text-start">
          <DialogTitle className="truncate">
            Delete &apos;{post?.title}&apos;?
          </DialogTitle>
          <DialogDescription>This action is irreversible.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose ref={closeRef} asChild>
            <Button variant="outline" className="rounded-full font-bold">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onDelete} className="rounded-full font-bold">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
