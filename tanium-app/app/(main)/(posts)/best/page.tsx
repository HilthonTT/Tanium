import { Suspense } from "react";

import { Container } from "@/components/container";

import { Posts, PostsSkeleton } from "../_components/posts";

const BestPage = () => {
  return (
    <div className="bg-black">
      <Container>
        <Suspense fallback={<PostsSkeleton />}>
          <Posts type="best" />
        </Suspense>
      </Container>
    </div>
  );
};

export default BestPage;
