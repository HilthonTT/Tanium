"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/store/use-modal-store";
import { instance } from "@/lib/axios-config";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is too short",
    })
    .max(50, {
      message: "Name is too long",
    }),
  description: z
    .string()
    .min(1, {
      message: "Description is too short",
    })
    .max(500, {
      message: "Description is too long",
    }),
  imageUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
});

export const CreateCommunityModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal((state) => state);
  const { token } = data;

  const isModalOpen = isOpen && type === "createCommunity";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      bannerUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        name: values.name || undefined,
        description: values.description || undefined,
        imageUrl: values.imageUrl || undefined,
        bannerUrl: values.bannerUrl || undefined,
      };

      const response = await instance.post("/api/community", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const createdCommunity = response.data;

      form.reset();
      router.refresh();

      router.push(`/community/${createdCommunity.id}`);
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
          <DialogTitle className="text-start">Create a community</DialogTitle>
        </DialogHeader>
        <Separator className="my-4" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-center">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        endpoint="communityImage"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="px-3 space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      <FormLabel className="text-lg font-bold">Name</FormLabel>
                      <FormDescription className="text-xs">
                        Choosing a name for your community is important to be
                        recognizable
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Community name..."
                        className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      <FormLabel className="text-lg font-bold">
                        Description
                      </FormLabel>
                      <FormDescription className="text-xs">
                        Describe who your community will attract
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Community description..."
                        className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-full font-bold">
                Cancel
              </Button>
              <Button type="submit" className="rounded-full font-bold">
                Create Community
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
