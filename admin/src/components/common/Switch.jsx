const Switch = ({
    title,
    isBlocked = false,
    label,
    dynamicBg = "bg-red-500",
    ...props
}) => {
    return (
        <label
            title={title}
            className={`relative inline-flex items-center gap-2 
            ${isBlocked ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
            <input
                {...props}
                type="checkbox"
                disabled={isBlocked}
                className="peer sr-only"
            />

            <div
                className={`relative h-6 w-11 rounded-full transition-color ${dynamicBg || "bg-gray-200"} peer-checked:${dynamicBg ? "" : ""}
                after:absolute after:start-[2px] after:top-[2px] 
                after:h-5 after:w-5 after:rounded-full after:border 
                after:border-gray-300 after:bg-white after:transition-all 
                after:content-[''] peer-checked:after:translate-x-full`}
            ></div>

            {label && <span className="text-sm">{label}</span>}
        </label>
    );
};

export default Switch;