import { auth } from "@clerk/nextjs";

import { PostCard, PostCardSkeleton } from "@/components/post-card";
import { isPro } from "@/lib/subscription";
import { isAllowedToCreateCommunity } from "@/lib/community-service";
import { getBestPosts, getHotPosts, getPosts } from "@/lib/post-service";
import { getSelf } from "@/lib/user-service";

import { CreatePostTab, CreatePostTabSkeleton } from "./create-post-tab";
import { FilterTab, FilterTabSkeleton } from "./filter-tab";
import { Advertising, AdvertisingSkeleton } from "./advertising";

type PostType = "all" | "hot" | "best";

interface PostsProps {
  type: PostType;
}

const getAllPosts = async (type: PostType) => {
  switch (type) {
    case "all":
      return await getPosts();
    case "best":
      return await getBestPosts();
    case "hot":
      return await getHotPosts();
    default:
      return await getPosts();
  }
};

export const Posts = async ({ type }: PostsProps) => {
  const { getToken } = auth();

  const [pro, allowedToCreateCommunities, posts, self, token] =
    await Promise.all([
      isPro(),
      isAllowedToCreateCommunity(),
      getAllPosts(type),
      getSelf(),
      getToken(),
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

export const PostsSkeleton = () => {
  return (
    <div className="pt-4 lg:flex lg:space-x-2 mx-2 lg:mx-0">
      {/* Left column for desktop */}
      <div className="lg:flex-1 space-y-4 lg:order-first">
        <div className="space-y-4 mb-5">
          <div className="lg:hidden">
            <AdvertisingSkeleton />
          </div>
          <CreatePostTabSkeleton />
          <FilterTabSkeleton />

          {[...Array(10)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Right column for desktop */}
      <div className="w-full lg:w-1/4 lg:flex lg:flex-col lg:order-last pt-4">
        <div className="lg:block hidden lg:w-full space-y-2">
          <AdvertisingSkeleton />
        </div>
      </div>
    </div>
  );
};
