"use client";
const DataNotFound = ({
    title = "Oops! Not Found",
    description = "Currently, there is no data available.",
    icon = "ri-file-search-line",
    className = "",
}) => {
    return (
        <div
            className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
        >
            <i className={`${icon} text-5xl text-gray-400 mb-3 ${className}`} />

            <h2 className={`h2 ${className}`}>
                {title}
            </h2>

            <p className={`p mt-1 max-w-md ${className}`}>
                {description}
            </p>
        </div>
    );
};

export default DataNotFound;
