"use client";

import qs from "query-string";
import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";

export const Search = () => {
  const [value, setValue] = useState("");

  const router = useRouter();

  const onSearch = () => {
    if (!value) {
      return;
    }

    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: {
          q: value,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="relative w-full px-4">
      <SearchIcon
        onClick={onSearch}
        className="absolute left-6 top-2 hover:opacity-85 transition cursor-pointer"
      />
      <Input
        className="w-full rounded-full pl-10"
        placeholder="Search Tanium..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
