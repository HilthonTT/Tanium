"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { instance } from "@/lib/axios-config";

interface ReplyFormProps {
  token: string | null;
  postId: number;
  self: User | null;
}

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Reply is too short",
  }),
  postId: z.number().min(1, {
    message: "Not a valid post",
  }),
});

export const ReplyForm = ({ token, postId, self }: ReplyFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      postId,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await instance.post("/api/reply", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      form.reset();

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2 w-full">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">
                  Comment as {self?.username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isLoading}
                    placeholder="What are your thoughts?"
                    rows={8}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex items-center justify-end">
            <Button type="submit" className="rounded-full">
              Comment
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
