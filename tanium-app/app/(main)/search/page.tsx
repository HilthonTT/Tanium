import { auth } from "@clerk/nextjs";

import { Container } from "@/components/container";
import { getPosts, searchPosts } from "@/lib/post-service";
import { getReplies, searchReplies } from "@/lib/reply-service";
import { getCommunities, searchCommunities } from "@/lib/community-service";
import { getSelf } from "@/lib/user-service";

import { SearchTabs } from "./_components/search-tabs";
import { Posts } from "./_components/posts";
import { Communities } from "./_components/communities";
import { Replies } from "./_components/replies";

type QueryType = "posts" | "comments" | "communities" | "people";

interface SearchPageProps {
  searchParams: {
    q: string;
    type: QueryType;
  };
}

const renderPosts = async (
  query: string | null,
  self: User | null,
  token: string | null
) => {
  const posts = query ? await searchPosts(query) : await getPosts();
  return (
    <Container className="mt-4 space-y-4">
      <SearchTabs />
      <Posts posts={posts} self={self} token={token} />
    </Container>
  );
};

const renderReplies = async (query: string | null) => {
  const replies = query ? await searchReplies(query) : await getReplies();

  return (
    <Container className="mt-4 space-y-4">
      <SearchTabs />
      <Replies replies={replies} />
    </Container>
  );
};

const renderCommunities = async (query: string | null) => {
  const communities = query
    ? await searchCommunities(query)
    : await getCommunities();

  return (
    <Container className="mt-4 space-y-4">
      <SearchTabs />
      <Communities communities={communities} />
    </Container>
  );
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { getToken } = auth();

  const [self, token] = await Promise.all([getSelf(), getToken()]);

  switch (searchParams.type) {
    case "posts":
      return renderPosts(searchParams.q, self, token);

    case "comments":
      return renderReplies(searchParams.q);

    case "communities":
      return renderCommunities(searchParams.q);

    default:
      return renderPosts(searchParams.q, self, token);
  }
};

export default SearchPage;