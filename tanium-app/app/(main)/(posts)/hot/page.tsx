import { Suspense } from "react";

import { Container } from "@/components/container";

import { Posts, PostsSkeleton } from "../_components/posts";

const HotPage = () => {
  return (
    <div className="bg-black">
      <Container>
        <Suspense fallback={<PostsSkeleton />}>
          <Posts type="hot" />
        </Suspense>
      </Container>
    </div>
  );
};

export default HotPage;
