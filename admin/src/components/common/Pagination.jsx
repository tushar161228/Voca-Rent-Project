"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


export default function Pagination({
    defaultCurrent = 1,
    total,
    pageSize = 10,
    onChange,
}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    //  memoize the value so it doesn't break the dependency array
    const pageNo = useMemo(() => {
        return searchParams.get("page");
    }, [searchParams]);


    const totalPages = Math.ceil(total / pageSize);
    const [currentPage, setCurrentPage] = useState(defaultCurrent);


    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        onChange?.(page);


        // Update the URL with the new page number
        const params = new URLSearchParams(searchParams);
        params.set("page", page);
        router.replace(`${pathname}?${params.toString()}`);
    };


    const getPageNumbers = useMemo(() => {
        const pages = [];


        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                // Show 1, 2, 3, 4, ..., totalPages
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Show 1, ..., totalPages-3, totalPages-2, totalPages-1, totalPages
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Show 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            }
        }


        return pages;
    }, [currentPage, totalPages]);


    useEffect(() => {
        pageNo && setCurrentPage(parseInt(pageNo));
        return () => { };
    }, [pageNo]);


    return (
        <div>
            <div className="flex w-fit items-center gap-1">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-navy-dark cursor-pointer relative rounded-full p-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Previous page"
                >
                    <span className="sr-only">Previous page</span>
                    <svg
                        className="h-5 w-5 text-slate-500 "
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
                {getPageNumbers.map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === "number" && handlePageChange(page)}
                        disabled={page === "..."}
                        className={`aspect-square h-9 rounded-full border-[1.5px] text-[14px] transition-all duration-100 ${page === currentPage
                            ? "border-purple-500 bg-purple-100 text-blue-700"
                            : "text-navy-dark border-[#DEE1E6] hover:bg-[#DEE1E6] cursor-pointer text-slate-800"
                            } ${page === "..." ? "cursor-default" : ""} `}
                        aria-current={page === currentPage ? "page" : undefined}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-navy-dark cursor-pointer relative rounded-full p-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Next page"
                >
                    <span className="sr-only">Next page</span>
                    <svg
                        className="h-5 w-5 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}



