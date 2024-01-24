"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ImageIcon, Mail } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { instance } from "@/lib/axios-config";
import { FileUpload } from "@/components/file-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface PostFormProps {
  token: string | null;
  post: Post;
}

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title is too short",
    })
    .max(50, {
      message: "Title is too long",
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
});

export const UpdateForm = ({ token, post }: PostFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl as string,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = { ...values, id: post.id };

      await instance.patch(`/api/post`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      form.reset();
      router.refresh();
      router.push(`/community/${post.communityId}/post/${post.id}`);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const isLoading = form.formState.isLoading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
        <div className="space-y-2 w-full">
          <div className="bg-background rounded-xl p-3 space-y-4">
            <Tabs defaultValue="post" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="post" className="w-full">
                  <div className="flex items-center justify-center">
                    <Mail className="mr-2" />
                    Post
                  </div>
                </TabsTrigger>
                <TabsTrigger value="files" className="w-full">
                  <div className="flex items-center justify-center">
                    <ImageIcon className="mr-2" />
                    File
                  </div>
                </TabsTrigger>
              </TabsList>
              <div className="my-4">
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          placeholder="Title..."
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <TabsContent value="post">
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isLoading}
                          placeholder="Description..."
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                          rows={8}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="files">
                <FormField
                  name="imageUrl"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-center">
                      <FormControl>
                        <FileUpload
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            <div className="flex items-center justify-between">
              <Button
                onClick={() => router.push("/")}
                type="button"
                variant="ghost"
                className="rounded-full">
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="rounded-full font-bold">
                Update
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
