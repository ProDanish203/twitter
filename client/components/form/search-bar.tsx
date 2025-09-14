"use client";
import { Search } from "lucide-react";
import { useState } from "react";

export const SearchBar = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="relative w-full py-3 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center border border-neutral-600 rounded-full px-3 py-2">
        <Search size={16} className="w-8 text-neutral-600" />

        <input
          type="text"
          className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none flex-1 w-full"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};
