import { Container } from "@/components/container";

import { HeaderTabs } from "./header-tabs";
import { Profile } from "./profile";

interface UserContainerProps {
  children: React.ReactNode;
  otherUser: User;
  self: User | null;
  isPrivate: boolean;
}

export const UserContainer = ({
  children,
  otherUser,
  self,
  isPrivate,
}: UserContainerProps) => {
  return (
    <div className="bg-black">
      <HeaderTabs user={otherUser} isPrivate={isPrivate} />
      <Container className="pt-2 w-full px-4 lg:px-0">
        <div className="bg-secondary rounded-md">
          <Profile user={otherUser} self={self} />
        </div>
        <div className="mt-4 pb-10">{children}</div>
      </Container>
    </div>
  );
};
