"use client";

const AuthLayout = ({
    children,
    title = "Sign in",
    heading = "VocaRent",
    description = "Sign in to manage your room rentals, tenants, bookings, and property listings seamlessly from one dashboard.",
}) => {
    return (
        <div className="min-h-screen bg-[#f4f4f4] overflow-hidden ">

            {/* LEFT SIDE */}
            <div className="relative w-full">

                {/* Gradient BG */}
                <div className="md:absolute inset-0 gradient " />

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-center px-4 py-16 md:py-20 lg:px-12 hidden md:block">
                    <div className="md:max-w-sm lg:max-w-md w-full">

                        <h1 className="mb-6 mdmb-10 text-xl md:text-2xl font-bold text-white capitalize">
                            {heading}
                        </h1>

                        <h2 className="mb-4 text-2xl md:text-3xl font-bold text-white capitalize">
                            {title}
                        </h2>

                        <p className="text-base md:text-[0.9rem] leading-8 text-white/90 ">
                            {description}
                        </p>
                    </div>
                </div>
                <div className="relative z-50 md:absolute md:top-18 md:right-4 lg:right-1/9 xl:right-1/5  md:max-w-sm lg:max-w-md w-full ">
                    <div className="w-full h-screen md:h-fit create-s-border rounded-lg md:rounded-xl lg:rounded-2xl pt-10 md:pt-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;