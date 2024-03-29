"use client";

import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={cn("max-w-5xl mx-auto relative h-auto bg-black", className)}>
      {children}
    </div>
  );
};
