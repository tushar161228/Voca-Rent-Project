import Link from "next/link";
import { twMerge } from "tailwind-merge";
import Spinner from "@/components/atoms/Spinner";

const variantClasses = {
  default:
    "back-border px-4 py-2 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all",

  outline:
    "back-border px-6 py-2.5 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-100 transition-all",

  primary:
    "btn-gradient px-4 py-2 text-white rounded-[10px] text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2",

  success: "bg-green-500 text-white",

  danger:
    "px-4 py-2 rounded-xl text-white text-sm font-medium bg-red-500 hover:bg-red-600 transition-all",

  secondary: "text-blue-500",

  white: "bg-white",

  black: "bg-gray-700 hover:bg-gray-300 text-white",

  brown:
    "brown-btn w-full mt-2 px-6 py-3 text-white rounded-lg md:rounded-xl font-medium transition-all shadow-lg hover:opacity-90",

  gradient:
    "btn-gradient flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg",
};

function Button({
  children,
  variant = "default",
  bgColor,
  textColor,
  icon: Icon,
  href,
  height = "",
  width = "",
  rounded = "",
  className,
  loading = false,
  disabled = false,
  ...props
}) {
  const isDisabled = disabled || loading;

  const baseClasses =
    "inline-flex items-center justify-center gap-2 text-sm font-medium transition duration-200 focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

  const variantClass =
    variantClasses[variant] || variantClasses.default;

  const classes = twMerge(
    baseClasses,
    variantClass,
    height,
    width,
    rounded,
    bgColor,
    textColor,
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {Icon && (
          <i className={`ri-${Icon} cursor-pointer`} />
        )}
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={16} color="#fff" />
          Processing...
        </>
      ) : (
        <>
          {Icon && (
            <i className={`ri-${Icon} cursor-pointer`} />
          )}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;