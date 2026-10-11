"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationLink = ({ title, icon, link, children = [] }) => {
  const pathname = usePathname();

  const hasChildren = children.length > 0;
  const isChildActive = children.some((child) =>
    pathname.startsWith(child.link)
  );

  const isActive =
    pathname === link ||
    (link !== "/" &&
      link !== "/client" &&
      pathname.startsWith(`${link}/`)) ||
    isChildActive;

  const [open, setOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) setOpen(true);
  }, [pathname]);

  return (
    <li>
      {/* MAIN LINK */}
      <Link
        href={link || "#"}
        onClick={() => hasChildren && setOpen(!open)}
        className={`flex items-center gap-3 px-3 py-1.5 text-sm rounded-xl transition-all group text-blue-100/80  hover:text-white tracking-wide
        ${isActive
            ? "bg-white/20 text-white border border-white/20 shadow-md"
            : "text-white/70 hover:translate-x-1 hover:bg-white/10"
          }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* ICON */}
          <i
            className={`${icon} text-lg transition-transform duration-300 group-hover:scale-110`}
          ></i>

          {/* TEXT */}
          <span className="text-sm truncate ">
            {title}
          </span>
        </div>

        {/* ARROW */}
        {hasChildren && (
          <i
            className={`ri-arrow-down-s-line transition-all duration-300 ${open ? "rotate-180" : "rotate-0"
              }`}
          ></i>
        )}
      </Link>

      {/* CHILDREN */}
      <div
        className={` transition-all duration-300 ${open ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
      >
        <ul className="ml-6 md:ml-8 space-y-2 text-sm">
          {children.map((child, index) => (
            <li key={index}>
              <Link
                href={child.link}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all group text-blue-100/80 hover:bg-white/10 hover:text-white
                ${pathname === child.link
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/10 hover:translate-x-1"
                  }`}
              >
                {child.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>


    </li>
  );
};

export default NavigationLink;