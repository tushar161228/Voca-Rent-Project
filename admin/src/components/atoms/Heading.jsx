"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "../common/Button";

const Heading = ({
  title,
  paragraph,
  actions = [],
  showLive = false,
  showBack = false,
  backRoute = "#",
  href = "",
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 ">
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => router.push(backRoute)}
            className="back-border w-9 h-9 flex items-center justify-center cursor-pointer rounded-xl text-slate-500 hover:bg-slate-100 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="lucide lucide-arrow-left w-4 h-4" data-fg-bzio3="1.39:565.12601:/src/app/pages/CreateStrategy.tsx:90:11:2335:33:e:ArrowLeft::::::EIC8" data-fgid-bzio3=":ri1:">
              <path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg></button>
        )}
        <div>
          <h1 className="font-[16px] md:text-[20px] lg:text-[22px] font-bold text-[#1d293d]">
            {title}
          </h1>

          {paragraph && (
            <p className=" bg-clip-text text-slate-500 mt-0.5 text-[13px]">
              {paragraph}
            </p>
          )}
        </div>
      </div>
      {(showLive || actions.length > 0) && (
        <div className="flex items-center gap-3">
          {showLive && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg md:rounded-xl lg:rounded-[14px]  text-emerald-700 text-[12px] font-semibold bg-emerald-100/70 badge-border">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Live
            </div>
          )}

          {actions.map((btn, i) => {
            if (btn.component) {
              return (
                <React.Fragment key={i}>
                  {btn.component}
                </React.Fragment>
              );
            }

            return (
              <Button
                key={i}
                href={btn.href}
                variant={
                  btn.variant || "gradient"
                }
                onClick={btn.onClick}
              >
                {btn.icon && (
                  <i className={btn.icon}></i>
                )}

                {btn.text}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};



export default Heading;
