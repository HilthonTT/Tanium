"use client";

import { CommunityDetails } from "./community-details";
import { PostDetails } from "./post-details";

interface DetailsProps {
  post: Post;
  community: Community;
  replies: Reply[];
  self: User | null;
  token: string | null;
}

export const Details = ({
  post,
  community,
  replies,
  self,
  token,
}: DetailsProps) => {
  return (
    <div className="lg:flex lg:space-x-2 mx-2 lg:mx-0 space-y-2 lg:space-y-0">
      <CommunityDetails community={community} className="lg:hidden" />
      <PostDetails
        community={community}
        post={post}
        token={token}
        self={self}
        replies={replies}
      />
      <CommunityDetails community={community} className="lg:block hidden" />
    </div>
  );
};
