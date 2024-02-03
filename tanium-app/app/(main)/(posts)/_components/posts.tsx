import { PostCard } from "@/components/post-card";
import { isPro } from "@/lib/subscription";
import { isAllowedToCreateCommunity } from "@/lib/community-service";

import { CreatePostTab } from "./create-post-tab";
import { FilterTab } from "./filter-tab";
import { Advertising } from "./advertising";

interface PostsProps {
  posts: Post[];
  self: User | null;
  token: string | null;
}

export const Posts = async ({ posts, self, token }: PostsProps) => {
  const [pro, allowedToCreateCommunities] = await Promise.all([
    isPro(),
    isAllowedToCreateCommunity(),
  ]);

  return (
    <div className="pt-4 lg:flex lg:space-x-2 mx-2 lg:mx-0">
      {/* Left column for desktop */}
      <div className="lg:flex-1 space-y-4 lg:order-first">
        <div className="space-y-4 mb-5">
          <div className="lg:hidden">
            <Advertising
              token={token}
              pro={pro}
              allowedToCreateCommunities={allowedToCreateCommunities}
            />
          </div>
          <CreatePostTab self={self} />
          <FilterTab />
          {posts.map((post) => (
            <PostCard key={post.id} post={post} token={token} self={self} />
          ))}
        </div>
      </div>

      {/* Right column for desktop */}
      <div className="w-full lg:w-1/4 lg:flex lg:flex-col lg:order-last pt-4">
        <div className="lg:block hidden lg:w-full space-y-2">
          <Advertising
            token={token}
            pro={pro}
            allowedToCreateCommunities={allowedToCreateCommunities}
          />
        </div>
      </div>
    </div>
  );
};
