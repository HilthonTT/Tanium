"use client";

import { ElementRef, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  reason: z
    .string()
    .min(1, {
      message: "Reason is too short",
    })
    .max(500, {
      message: "Reason is too long",
    }),
});

export const BanMemberModal = () => {
  const closeRef = useRef<ElementRef<"button">>(null);

  const router = useRouter();
  const { isOpen, type, data, onClose } = useModal((state) => state);
  const { member, token, community } = data;

  const isModalOpen = isOpen && type === "banMember";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        reason: values.reason,
        communityId: community?.id,
        bannedUserId: member?.user.id,
      };

      await instance.post("/api/ban", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onClose();
      router.refresh();
      toast.success("User banned!");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader className="text-start">
              <DialogTitle className="truncate capitalize">
                Ban &apos;{member?.user.username}&apos;?
              </DialogTitle>
              <DialogDescription>
                Banning this user means that they won&apos;t be able to access
                anything from the community.
              </DialogDescription>
            </DialogHeader>
            <div className="">
              <FormField
                name="reason"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Put a reason on why they're being banned."
                        className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose ref={closeRef} asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full font-bold"
                  disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="rounded-full font-bold"
                disabled={isLoading}>
                Ban
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
