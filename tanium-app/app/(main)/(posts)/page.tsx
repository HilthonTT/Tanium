import { Suspense } from "react";

import { Container } from "@/components/container";

import { Posts, PostsSkeleton } from "./_components/posts";

const MainPage = () => {
  return (
    <div className="bg-black">
      <Container>
        <Suspense fallback={<PostsSkeleton />}>
          <Posts type="all" />
        </Suspense>
      </Container>
    </div>
  );
};

export default MainPage;
