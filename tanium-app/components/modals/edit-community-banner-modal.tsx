"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/store/use-modal-store";
import { instance } from "@/lib/axios-config";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  bannerUrl: z.string().optional(),
});

export const EditCommunityBannerModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal((state) => state);
  const { token, community } = data;

  const isModalOpen = isOpen && type === "editCommunityBanner";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bannerUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        id: community?.id,
        name: community?.name,
        description: community?.description,
        imageUrl: community?.imageUrl || undefined,
        bannerUrl: values?.bannerUrl || undefined,
      };

      await instance.patch("/api/community", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-start">
            Update Community Banner
          </DialogTitle>
        </DialogHeader>
        <Separator className="my-4" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-center">
              <FormField
                control={form.control}
                name="bannerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full font-bold">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-full font-bold">
                Update Banner
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
