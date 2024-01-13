import { UserButton, currentUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";

import { Logo } from "./logo";
import { Selector } from "./selector";
import { Search } from "./search";

export const Navbar = async () => {
  const user = await currentUser();

  return (
    <div className="fixed top-0 h-16 w-full bg-zinc-900">
      <div className="flex items-center justify-between mx-4 my-1">
        <div className="flex items-center justify-center space-x-4">
          <Logo />
          <Selector username={user?.username!} imageUrl={user?.imageUrl!} />
        </div>
        <div className="flex items-center justify-center w-full">
          <Search />
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Hint label="Create post" asChild>
            <Button aria-label="Create post" variant="ghost" className="p-1">
              <Plus className="h-6 w-6" />
            </Button>
          </Hint>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};
