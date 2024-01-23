import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { getSelf, getUser } from "@/lib/user-service";

import { HeaderTabs } from "./_components/header-tabs";

interface UserIdPageProps {
  params: {
    userId: number;
  };
}

const UserIdPage = async ({ params }: UserIdPageProps) => {
  const self = await getSelf();

  const otherUser = await getUser(params.userId);
  if (!otherUser) {
    return notFound();
  }

  return (
    <>
      <HeaderTabs user={otherUser} />
      <Container className="pt-2">e</Container>
    </>
  );
};

export default UserIdPage;
