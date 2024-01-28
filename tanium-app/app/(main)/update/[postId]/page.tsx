import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { getSelf } from "@/lib/user-service";
import { getPost } from "@/lib/post-service";
import { Separator } from "@/components/ui/separator";

import { UpdateForm } from "./_components/update-form";

interface UpdatePageProps {
  params: {
    postId: number;
  };
}

const UpdatePage = async ({ params }: UpdatePageProps) => {
  const { getToken } = auth();

  const [self, token] = await Promise.all([getSelf(), getToken()]);

  if (!self) {
    return redirect("/sign-in");
  }

  const post = await getPost(params.postId);
  if (!post) {
    return notFound();
  }

  const isAllowed = post.userId === self.id;
  if (!isAllowed) {
    return notFound();
  }

  return (
    <div className="h-full p-4 space-y-2 max-w-4xl mx-auto bg-black">
      <h1 className="font-bold text-xl truncate">Update {post.title}</h1>
      <Separator />
      <UpdateForm token={token} post={post} />
    </div>
  );
};

export default UpdatePage;
