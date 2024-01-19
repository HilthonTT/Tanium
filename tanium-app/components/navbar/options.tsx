"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { LogInIcon, Plus } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useModal } from "@/store/use-modal-store";

interface OptionsProps {
  token: string | null;
}

export const Options = ({ token }: OptionsProps) => {
  const { onOpen } = useModal((state) => state);

  const handleOpen = () => {
    onOpen("createCommunity", { token });
  };

  return (
    <>
      <Hint label="Create post" asChild>
        <Button
          onClick={handleOpen}
          aria-label="Create post"
          variant="ghost"
          className="p-1">
          <Plus className="h-6 w-6" />
        </Button>
      </Hint>
      <UserButton afterSignOutUrl="/" />
      {!token && (
        <SignInButton>
          <Button aria-label="Login" variant="ghost">
            <LogInIcon className="h-6 w-6" />
          </Button>
        </SignInButton>
      )}
    </>
  );
};
