"use client";

import clsx from "clsx";

const OverviewCard = ({
  title,
  value,
  valueColor,
}) => {
  return (
    <div
      className="w-full rounded-lg md:rounded-xl lg:rounded-2xl p-4 sm:p-5 create-s-border overflow-hidden"
    >
      <p className="text-[13px] text-slate-500">
        {title}
      </p>

      <h2
        className={clsx(
          "text-xl sm:text-2xl lg:text-3xl font-semibold mt-2 line-clamp-1",
          valueColor ||
          "text-[var(--color-gray-900)] dark:text-[var(--color-white)]"
        )}
      >
        {value}
      </h2>
    </div>
  );
};

export default OverviewCard;