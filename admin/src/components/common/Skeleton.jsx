"use client";

const Skeleton = ({ variant = "card", width }) => {

    //  Text Skeleton
    if (variant === "text") {
        return (
            <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        );
    }

    //  Strategy Card
    if (variant === "strategy-card") {
        return (
            <div className="bg-white border border-gray-200 rounded-md md:rounded-xl lg:rounded-2xl shadow-xl shadow-gray-200 overflow-hidden flex flex-col h-full animate-pulse">

                {/* Header */}
                <div className="relative p-4 sm:p-5 bg-gradient-to-br from-gray-300 to-gray-200">
                    <div className="flex justify-between items-start gap-4">

                        {/* LEFT */}
                        <div className="flex-1">
                            <div className="h-4 w-32 bg-gray-400 rounded mb-3"></div>

                            <div className="flex items-center gap-2">
                                <div className="h-3 w-16 bg-gray-400 rounded"></div>
                                <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                                <div className="h-3 w-20 bg-gray-400 rounded-full"></div>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col gap-2 items-end">
                            <div className="flex items-center gap-2">
                                <div className="h-5 w-14 bg-gray-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="h-5 w-14 bg-gray-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="p-3 sm:p-4 md:p-5 grid grid-cols-2 gap-2 sm:gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-100 border border-gray-200 p-3 rounded-md md:rounded-lg lg:rounded-xl"
                        >
                            <div className="h-3 w-20 bg-gray-300 rounded mb-2"></div>
                            <div className="h-4 w-12 bg-gray-400 rounded"></div>
                        </div>
                    ))}
                </div>

                {/* Avg Profit */}
                <div className="px-3 md:px-5 pb-3 md:pb-8">
                    <div className="bg-gray-100 border border-gray-200 rounded p-3 flex justify-between">
                        <div>
                            <div className="h-3 w-16 bg-gray-300 rounded mb-2"></div>
                            <div className="h-4 w-12 bg-gray-400 rounded"></div>
                        </div>

                        <div className="text-right">
                            <div className="h-3 w-16 bg-gray-300 rounded mb-2"></div>
                            <div className="h-4 w-12 bg-gray-400 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 divide-x text-gray-200  border-t border-gray-200 bg-gray-50">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="py-3 flex justify-center">
                            <div className="h-4 w-16 bg-gray-300 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

        );
    }

    // SUBSCRIPTION PLAN CARD
    if (variant === "subscription-card") {
        return (
            <div className="w-full h-full create-s-border rounded-lg md:rounded-xl lg:rounded-2xl overflow-hidden animate-pulse">

                {/* HEADER */}
                <div className="relative p-4 sm:p-5 md:p-6 bg-gradient-to-br from-gray-300 to-gray-200 overflow-hidden">

                    <div className="absolute -top-0 -right-0 w-20 h-20 rounded-full bg-white/20" />

                    {/* TITLE */}
                    <div className="h-4 w-28 bg-white/60 rounded-md" />

                    {/* PRICE */}
                    <div className="h-10 w-32 bg-white/70 rounded-md mt-4" />

                    {/* DURATION */}
                    <div className="h-3 w-20 bg-white/50 rounded-md mt-3" />
                </div>

                {/* BODY */}
                <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">

                    {/* TOP */}
                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-gray-200" />

                            <div className="h-4 w-20 bg-gray-200 rounded-md" />
                        </div>

                        <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    </div>

                    <hr className="my-4 border-gray-100" />

                    {/* STRATEGY */}
                    <div>
                        <div className="h-3 w-32 bg-gray-200 rounded-md" />

                        <div className="h-7 w-14 bg-gray-300 rounded-md mt-3" />
                    </div>

                    {/* FEATURES */}
                    <div className="mt-5 flex-1">

                        <div className="h-3 w-20 bg-gray-200 rounded-md mb-4" />

                        <div className="space-y-3">

                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-2"
                                >
                                    <div className="h-4 w-4 rounded-full bg-gray-200 shrink-0" />

                                    <div className="h-3 w-full bg-gray-200 rounded-md" />
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* BUTTON */}
                    <div className="mt-5">
                        <div className="h-11 w-full rounded-xl bg-gray-200" />
                    </div>
                </div>
            </div>
        );
    }


    //  Default Card Skeleton
    return (
        <div className="animate-pulse bg-gray-200 rounded-md p-6 space-y-3">
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
    );

};

export default Skeleton;

