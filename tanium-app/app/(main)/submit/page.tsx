import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { getUserCommunity } from "@/lib/community-service";

import { PostForm } from "./_components/post-form";

const SubmitPage = async () => {
  const { getToken } = auth();
  const token = await getToken();
  if (!token) {
    return redirect("/sign-in");
  }

  const communities = await getUserCommunity();

  return (
    <div className="h-full p-4 space-y-2 max-w-4xl mx-auto">
      <h1 className="font-bold text-xl">Create a post</h1>
      <Separator />
      <PostForm communities={communities} token={token} />
    </div>
  );
};

export default SubmitPage;
