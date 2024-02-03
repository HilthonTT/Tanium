"use client";

import { PostCard, PostCardSkeleton } from "@/components/post-card";

import { CreatePostTab, CreatePostTabSkeleton } from "./create-post-tab";
import { FilterTab, FilterTabSkeleton } from "./filter-tab";
import {
  CommunityDetails,
  CommunityDetailsSkeleton,
} from "./community-details";

interface PostsProps {
  posts: Post[];
  self: User | null;
  token: string | null;
  community: Community;
  isMember: boolean;
}

export const Posts = ({
  posts,
  self,
  token,
  community,
  isMember,
}: PostsProps) => {
  return (
    <div className="pt-4 lg:flex lg:space-x-2 mx-2 lg:mx-0">
      {/* Left column for desktop */}
      <div className="lg:flex-1 space-y-4 lg:order-first">
        <div className="space-y-4 mb-5">
          <div className="lg:hidden">
            <CommunityDetails community={community} isMember={isMember} />
          </div>
          {isMember && <CreatePostTab self={self} community={community} />}
          <FilterTab communityId={community.id} />
          {posts.map((post) => (
            <PostCard key={post.id} post={post} token={token} self={self} />
          ))}
        </div>
      </div>

      {/* Right column for desktop */}
      <div className="w-full lg:w-1/4 lg:flex lg:flex-col lg:order-last pt-4">
        <div className="lg:block hidden lg:w-full space-y-2">
          <CommunityDetails community={community} isMember={isMember} />
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
            <CommunityDetailsSkeleton />
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
          <CommunityDetailsSkeleton />
        </div>
      </div>
    </div>
  );
};
