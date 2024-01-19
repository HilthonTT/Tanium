import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { getUserCommunity } from "@/lib/community-service";

import { PostForm } from "./_components/post-form";

interface SubmitPageProps {
  searchParams: {
    media: boolean;
    communityId: number;
  };
}

const SubmitPage = async ({ searchParams }: SubmitPageProps) => {
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
      <PostForm
        communities={communities}
        token={token}
        media={searchParams.media}
        communityId={searchParams.communityId}
      />
    </div>
  );
};

export default SubmitPage;
