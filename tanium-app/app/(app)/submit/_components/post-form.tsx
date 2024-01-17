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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { instance } from "@/lib/axios-config";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { UserAvatar } from "@/components/user-avatar";
import { FileUpload } from "@/components/file-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface PostFormProps {
  token: string | null;
  communities: Community[];
  media?: boolean;
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
  communityId: z.number().min(1, {
    message: "Not a valid community",
  }),
  imageUrl: z.string().optional(),
});

export const PostForm = ({
  communities,
  token,
  media = false,
}: PostFormProps) => {
  const router = useRouter();

  const firstCommunity = communities[0];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      communityId: firstCommunity?.id || 0,
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        title: values.title || undefined,
        description: values.description || undefined,
        communityId: values.communityId || firstCommunity.id,
        imageUrl: values.imageUrl || undefined,
      };

      const response = await instance.post("/api/post", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const post = response.data as Post;

      router.refresh();

      form.reset();
      router.push(`/community/${post.communityId}/post/${post.id}`);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
        <div className="space-y-2 w-full">
          <FormField
            name="communityId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={String(field.value)}
                  defaultValue={String(field.value)}>
                  <FormControl>
                    <SelectTrigger className="w-[350px]">
                      <div className="flex items-center space-x-2">
                        <UserAvatar
                          username={firstCommunity?.name}
                          imageUrl={firstCommunity?.imageUrl || ""}
                        />
                        <p className="font-semibold">{firstCommunity?.name}</p>
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Communities</SelectLabel>
                      {communities?.map((community) => (
                        <SelectItem
                          key={community.id}
                          value={String(community.id)}>
                          <div className="flex items-center space-x-2">
                            <UserAvatar
                              username={community?.name}
                              imageUrl={community?.imageUrl || ""}
                            />
                            <p className="font-semibold">{community?.name}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a community for your post
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="bg-background rounded-xl p-3 space-y-4">
            <Tabs defaultValue={media ? "files" : "post"} className="w-full">
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
              <Button type="button" variant="ghost" className="rounded-full">
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="rounded-full font-bold">
                Post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
