import { auth } from "@clerk/nextjs";
import { Suspense } from "react";

import { Container } from "@/components/container";
import { getPosts, searchPosts } from "@/lib/post-service";
import { getReplies, searchReplies } from "@/lib/reply-service";
import { getCommunities, searchCommunities } from "@/lib/community-service";
import { getSelf, getUsers, searchUsers } from "@/lib/user-service";

import { SearchTabs } from "./_components/search-tabs";
import { Posts, PostsSkeleton } from "./_components/posts";
import { Communities, CommunitiesSkeleton } from "./_components/communities";
import { Replies, RepliesSkeleton } from "./_components/replies";
import { Users, UsersSkeleton } from "./_components/users";

type QueryType = "posts" | "comments" | "communities" | "people";

interface SearchPageProps {
  searchParams: {
    q: string;
    type: QueryType;
  };
}

interface RenderProps {
  query: string | null;
  self?: User | null;
  token?: string | null;
}

const RenderPosts = async ({ query, self, token }: RenderProps) => {
  const posts = query ? await searchPosts(query) : await getPosts();

  return (
    <div className="bg-black">
      <Container className="mt-4 space-y-4">
        <SearchTabs />
        <Posts posts={posts} self={self || null} token={token || null} />
      </Container>
    </div>
  );
};

export const RenderReplies = async ({ query }: RenderProps) => {
  const replies = query ? await searchReplies(query) : await getReplies();

  return (
    <div className="bg-black">
      <Container className="mt-4 space-y-4">
        <SearchTabs />
        <Replies replies={replies} />
      </Container>
    </div>
  );
};

const RenderCommunities = async ({ query }: RenderProps) => {
  const communities = query
    ? await searchCommunities(query)
    : await getCommunities();

  return (
    <div className="bg-black">
      <Container className="mt-4 space-y-4">
        <SearchTabs />
        <Communities communities={communities} />
      </Container>
    </div>
  );
};

const RenderUsers = async ({ query }: RenderProps) => {
  const users = query ? await searchUsers(query) : await getUsers();

  return (
    <div className="bg-black">
      <Container className="mt-4 space-y-4">
        <SearchTabs />
        <Users users={users} />
      </Container>
    </div>
  );
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { getToken } = auth();

  const [self, token] = await Promise.all([getSelf(), getToken()]);

  switch (searchParams.type) {
    case "posts":
      return (
        <Suspense fallback={<PostsSkeleton />}>
          <RenderPosts query={searchParams.q} self={self} />
        </Suspense>
      );

    case "comments":
      return (
        <Suspense fallback={<RepliesSkeleton />}>
          <RenderReplies query={searchParams.q} />
        </Suspense>
      );

    case "communities":
      return (
        <Suspense fallback={<CommunitiesSkeleton />}>
          <RenderCommunities query={searchParams.q} />
        </Suspense>
      );

    case "people":
      return (
        <Suspense fallback={<UsersSkeleton />}>
          <RenderUsers query={searchParams.q} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<PostsSkeleton />}>
          <RenderPosts query={searchParams.q} self={self} token={token} />
        </Suspense>
      );
  }
};

export default SearchPage;
