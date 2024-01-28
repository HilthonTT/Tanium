import { auth } from "@clerk/nextjs";

import { getSelf } from "@/lib/user-service";
import { getUserCommunity } from "@/lib/community-service";

import { Logo } from "./logo";
import { Selector } from "./selector";
import { Search } from "./search";
import { Options } from "./options";

export const Navbar = async () => {
  const { getToken } = auth();

  const [self, communities, token] = await Promise.all([
    getSelf(),
    getUserCommunity(),
    getToken(),
  ]);

  return (
    <div className="fixed top-0 h-16 w-full bg-zinc-900 z-50">
      <div className="flex items-center justify-between mx-4 my-1 h-full pb-2">
        <div className="flex items-center justify-center space-x-4">
          <Logo />
          <Selector self={self} communities={communities} token={token} />
        </div>
        <div className="flex items-center justify-center w-full">
          <Search />
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Options token={token} />
        </div>
      </div>
    </div>
  );
};
