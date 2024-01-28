"use client";

import qs from "query-string";
import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

export const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const type = searchParams.get("type");

  const [value, setValue] = useState(query || "");

  const onSearch = () => {
    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: {
          q: value,
          type,
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
    <div className="relative px-4 w-56 md:w-full xl:w-full">
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
