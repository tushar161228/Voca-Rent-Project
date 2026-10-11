"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
const SearchBarComp = ({
  iconLeft = false,
  iconRight = false,
  className = "",
  keyName = "search",
  customRoute,
  ...props
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const qParam = searchParams.get(keyName) || "";
  const [query, setQuery] = useState(qParam);

  // Keep local state synced when navigating
  useEffect(() => {
    setQuery(qParam);
  }, [qParam]);

  //  Common search handler (ONLY REQUIRED CHANGE)
  const runSearch = () => {
    if (query.trim().length >= 2) {
      const params = new URLSearchParams(searchParams.toString());

      params.set(keyName, query.trim());

      if (customRoute) {
        router.push(`${customRoute}?${params.toString()}`);

      } else {
        router.push(`${pathname}?${params.toString()}`);

      }
    }
  };

  //  Key handling
  const handleKeyDown = (e) => {
    if (e.key === "Enter") runSearch();
    if (e.key === "Escape") clearSearch();
  };

  //  Clear search (ONLY REQUIRED CHANGE)
  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete(keyName);

    router.push(`${pathname}?${params.toString()}`);
    setQuery("");
  };

  return (
    <div
      className="relative w-full pr-4 ">
      {/* Left Icon */}
      {iconLeft && (
        <button
          type="button"
          onClick={runSearch}
          className="text-md  absolute top-1.5 left-3.5 font-extralight text-slate-400 hover:text-gray-700"
        >
          <i className="ri-search-line" />
        </button>
      )}

      <input
        {...props}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`line-clamp-1 pr-2 w-full  text-sm py-2 text-sm rounded-xl bg-[#F8FAFC]/90 border border-slate-400/25 text-slate-900  focus:ring-2 focus:ring-blue-500/40 placeholder:font-light transition-all outline-none ${iconLeft ? "pl-9" : ""
          } ${iconRight ? "pr-6" : ""} ${className}`}
      />

      {/* Right Icon → toggle between clear & search */}
      {query || qParam ? (
        <button
          type="button"
          onClick={clearSearch}
          className="text-sm absolute top-1.5 right-6 aspect-square h-6 rounded-full font-light text-gray-500 transition-all duration-100 hover:bg-gray-100 hover:text-gray-700"
        >
          <i className="ri-close-line cursor-pointer" />
        </button>
      ) : (
        iconRight && (
          <button
            type="button"
            onClick={runSearch}
            className="absolute top-1.5 right-2.5 cursor-pointer text-lg font-light text-black hover:text-black"
          >
            <i className="ri-search-line" />
          </button>
        )
      )}
    </div>
  );
};

const SearchBox = (props) => (
  <Suspense fallback={<>Loading...</>}>
    <SearchBarComp {...props} />
  </Suspense>
);

export default SearchBox;
