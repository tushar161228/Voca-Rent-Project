"use client";

import clsx from "clsx";

// Predefined color skins
const colorMap = {
  buy: "badge",
  sell: "bg-red-50 text-red-700 border-red-200",
  live: "bg-blue-600 text-white border-blue-600 rounded",
  paper: "bg-gray-600 text-white border-gray-600 rounded",
  open: "bg-amber-50 text-amber-700 border-amber-200",
  closed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  incoming: "bg-rose-50 text-rose-700 border-rose-200",
  approved:
    "bg-linear-to-br from-green-500/80 to-emerald-500/80 text-white",
  confirmed: "bg-green-50 text-green-700 border-green-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  pass: "bg-green-50 text-green-700 border-green-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  resolved: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  upcoming: "bg-yellow-50 text-yellow-700 border-yellow-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-red-50 text-red-700 border-red-200 animate-pulse",
  unpaid: "bg-yellow-50 text-yellow-700 border-yellow-200",
  active: "bg-green-50 text-green-700 border-green-200",
  blocked: "bg-red-50 text-red-700 border-red-200",
  "under review": "bg-blue-50 text-blue-700 border-blue-200",
  inactive: "bg-gray-50 text-gray-700 border-gray-200",
  hold: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  success: "bg-blue-50 text-blue-700 border-blue-200",
  failed: "bg-rose-50 text-rose-700 border-rose-200",
  ended: "bg-rose-50 text-rose-700 border-rose-200",
  bestseller: "bg-teal-50 text-teal-700 border-teal-200",
  visible: "bg-emerald-50 text-emerald-700 border-emerald-200",
  hidden: "bg-red-50 text-red-700 border-red-200",
};

const iconColorMap = {
  open: "text-amber-700",
  closed: "text-emerald-700",
  executed: "text-green-600",
};

const circleColorMap = {
  buy: "bg-green-400",
  sell: "bg-red-400",
  live: "bg-blue-400",
  paper: "bg-gray-400",
  open: "bg-orange-400",
  closed: "bg-emerald-400",
  incoming: "bg-rose-400",
  approved: "bg-green-400",
  confirmed: "bg-green-400",
  paid: "bg-green-400",
  pass: "bg-green-400",
  delivered: "bg-green-400",
  resolved: "bg-green-400",
  pending: "bg-yellow-400",
  upcoming: "bg-yellow-400",
  unpaid: "bg-yellow-400",
  rejected: "bg-red-400",
  cancelled: "bg-red-400 animate-pulse",
  active: "bg-green-500 animate-pulse",
  blocked: "bg-red-400",
  "under review": "bg-blue-400",
  inactive: "bg-gray-400",
  hold: "bg-red-400",
  completed: "bg-emerald-400",
  success: "bg-blue-400",
  failed: "bg-rose-400",
  ended: "bg-rose-400",
  bestseller: "bg-teal-400",
  visible: "bg-emerald-400",
  hidden: "bg-red-400",
};

// FIXED STATIC FALLBACK
const defaultStyle =
  "bg-gray-100 text-gray-700 border-gray-200";

const defaultCircleStyle =
  "bg-gray-400";

const defaultIconStyle =
  "text-gray-600";

export const Badge = ({
  text = "N/A",
  customStyle,
  variant,
  icon,
}) => {
  const key = text?.toLowerCase()?.trim();

  const style = colorMap[key] || defaultStyle;

  const circleStyle =
    circleColorMap[key] || defaultCircleStyle;

  const iconColorStyle =
    iconColorMap[key] || defaultIconStyle;

  return (
    <>
      {variant === "simple" ? (
        <span
          className={clsx(
            "badge-border text-[13px] font-semibold inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full capitalize",
            style,
            customStyle
          )}
        >
          {text}
        </span>
      ) : variant === "iconCircle" ? (
        <span
          className={clsx(
            "text-[12px] flex items-center gap-1.5",
            iconColorStyle
          )}
        >
          {icon && (
            <i className={`ri-${icon} text-[15px]`} />
          )}

          {text && (
            <span className="capitalize font-semibold">
              {text}
            </span>
          )}
        </span>
      ) : (
        <span
          className={clsx(
            "badge-border text-[11px] font-semibold inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full capitalize",
            style,
            customStyle
          )}
        >
          <span
            className={clsx(
              "w-1.5 h-1.5 rounded-full",
              circleStyle
            )}
          />

          {text}
        </span>
      )}
    </>
  );
};

export default Badge;