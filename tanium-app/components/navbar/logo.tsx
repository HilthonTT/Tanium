"use client";

import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="hover:opacity-85 transition">
      <div className="flex items-center justify-center space-x-2">
        <div className="relative h-14 w-14">
          <Image
            src="/logo.svg"
            className="object-cover bg-white rounded-full"
            alt="Logo"
            priority
            fill
          />
        </div>
        <p className="font-bold text-xl text-white">Tanium</p>
      </div>
    </Link>
  );
};
