"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { instance } from "@/lib/axios-config";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Verified, X } from "lucide-react";
import { Hint } from "@/components/hint";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface EditFormProps {
  community: Community;
  token: string;
}

const nameFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is too short",
    })
    .max(50, {
      message: "Name is too long",
    }),
});

const descriptionFormSchema = z.object({
  description: z
    .string()
    .min(1, {
      message: "Description is too short",
    })
    .max(500, {
      message: "Description is too long",
    }),
});

export const EditForm = ({ community, token }: EditFormProps) => {
  const router = useRouter();

  const [name, setName] = useState(community.name);
  const [description, setDescription] = useState(community.description);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const nameForm = useForm<z.infer<typeof nameFormSchema>>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      name: community.name,
    },
  });

  const descriptionForm = useForm<z.infer<typeof descriptionFormSchema>>({
    resolver: zodResolver(descriptionFormSchema),
    defaultValues: {
      description: community.description,
    },
  });

  const isLoadingName = nameForm.formState.isSubmitting;
  const isLoadingDescription = descriptionForm.formState.isSubmitting;

  const onSubmitName = async (values: z.infer<typeof nameFormSchema>) => {
    try {
      setName(values.name);

      const data = {
        id: community.id,
        name: values.name || undefined,
        description: community.description || undefined,
        imageUrl: community.imageUrl || undefined,
        bannerUrl: community.bannerUrl || undefined,
      };

      await instance.patch("/api/community", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsEditingName(false);
      toast.success("Community name updated!");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onSubmitDescription = async (
    values: z.infer<typeof descriptionFormSchema>
  ) => {
    try {
      setDescription(values.description);

      const data = {
        id: community.id,
        name: community.name || undefined,
        description: values.description || undefined,
        imageUrl: community.imageUrl || undefined,
        bannerUrl: community.bannerUrl || undefined,
      };

      await instance.patch("/api/community", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsEditingDescription(false);
      toast.success("Community description updated!");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onEditName = () => {
    setIsEditingName(true);
  };

  const onEditDescription = () => {
    setIsEditingDescription(true);
  };

  const onDisableEditName = () => {
    setIsEditingName(false);
  };

  const onDisableEditDescription = () => {
    setIsEditingDescription(false);
  };

  return (
    <div className="w-full h-full space-y-4 pt-10 px-4 lg:px-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings Page</h1>
        <Button variant="outline" asChild>
          <Link href={`/community/${community.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Link>
        </Button>
      </div>
      <Separator className="my-4" />

      <h2 className="text-xl font-bold">Name</h2>
      <Separator className="my-4" />
      <div className="rounded-md bg-secondary p-2">
        {!isEditingName && (
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold truncate">{name}</p>
            <Hint label="Edit Name" asChild>
              <Button
                onClick={onEditName}
                className="mb-auto mt-0"
                aria-label="Edit Name">
                <Pencil className="h-5 w-5" />
              </Button>
            </Hint>
          </div>
        )}
        {isEditingName && (
          <Form {...nameForm}>
            <form
              onSubmit={nameForm.handleSubmit(onSubmitName)}
              className="space-y-8 w-full">
              <div className="flex items-center justify-start">
                <FormField
                  control={nameForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="flex items-center justify-between space-x-2">
                          <Input
                            {...field}
                            type="text"
                            placeholder="Community name..."
                            className="focus-visible:ring-0 focus-visible:ring-offset-0 text-xl font-semibold"
                            disabled={isLoadingName}
                          />
                          <Button aria-label="Update Name" type="submit">
                            <Verified className="h-5 w-5" />
                          </Button>
                          <Button
                            onClick={onDisableEditName}
                            aria-label="Cancel Edit Name"
                            type="button">
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        )}
      </div>
      <h2 className="text-xl font-bold">Description</h2>
      <Separator className="my-4" />
      <div className="rounded-md bg-secondary p-2 h-auto min-h-36">
        {!isEditingDescription && (
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold break-words">{description}</p>
            <Hint label="Edit Description" asChild>
              <Button
                onClick={onEditDescription}
                className="mb-auto mt-0"
                aria-label="Edit Descriptio">
                <Pencil className="h-5 w-5" />
              </Button>
            </Hint>
          </div>
        )}
        {isEditingDescription && (
          <Form {...descriptionForm}>
            <form
              onSubmit={descriptionForm.handleSubmit(onSubmitDescription)}
              className="space-y-8 w-full">
              <div className="flex items-center justify-start">
                <FormField
                  control={descriptionForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="flex items-center justify-between space-x-2">
                          <Textarea
                            {...field}
                            placeholder="Community description..."
                            className="focus-visible:ring-0 focus-visible:ring-offset-0"
                            disabled={isLoadingDescription}
                          />
                          <Button aria-label="Update Description" type="submit">
                            <Verified className="h-5 w-5" />
                          </Button>
                          <Button
                            onClick={onDisableEditDescription}
                            aria-label="Cancel Edit Description"
                            type="button">
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};
