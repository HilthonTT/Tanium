"use client";

import { BombIcon } from "lucide-react";

const Error = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center justify-center space-y-2">
        <BombIcon className="animate-spin w-8 h-8" />
        <h1 className="text-muted-foreground font-semibold">
          Something went wrong...
        </h1>
      </div>
    </div>
  );
};

export default Error;
